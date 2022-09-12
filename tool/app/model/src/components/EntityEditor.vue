<template>
  <div @shortkey="cleanUp">
    <v-annotator
        :rtl="rtl"
        :text="text"
        :entities="entities"
        :entity-labels="entityLabels"
        :relations="relations"
        :relation-labels="relationLabels"
        :allow-overlapping="allowOverlapping"
        :grapheme-mode="graphemeMode"
        :selected-entities="selectedEntities"
        @add:entity="handleAddEvent"
        @click:entity="onEntityClicked"
        @click:relation="onRelationClicked"
        @contextmenu:entity="deleteEntity"
        @contextmenu:relation="deleteRelation"
    />
    <labeling-menu
        :opened="entityMenuOpened"
        :x="x"
        :y="y"
        :selected-label="currentLabel"
        :labels="entityLabels"
        @close="cleanUp"
        @click:label="addOrUpdateEntity"
    />
    <labeling-menu
        :opened="relationMenuOpened"
        :x="x"
        :y="y"
        :selected-label="currentRelationLabel"
        :labels="relationLabels"
        @close="cleanUp"
        @click:label="addOrUpdateRelation"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import VAnnotator from 'v-annotator'
import LabelingMenu from './LabelingMenu.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'


export default Vue.extend({
  components: {
    VAnnotator,
    LabelingMenu
  },

  props: {
    dark: {
      type: Boolean,
      default: false
    },
    rtl: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: '',
      required: true
    },
    entities: {
      type: Array,
      default: () => [],
      required: true
    },
    entityLabels: {
      type: Array,
      default: () => [],
      required: true
    },
    relations: {
      type: Array,
      default: () => []
    },
    relationLabels: {
      type: Array,
      default: () => []
    },
    allowOverlapping: {
      type: Boolean,
      default: false,
      required: false
    },
    graphemeMode: {
      type: Boolean,
      default: false
    },
    selectedLabel: {
      type: Object,
      default: null,
      required: false
    },
    relationMode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      entityMenuOpened: false,
      relationMenuOpened: false,
      x: 0,
      y: 0,
      startOffset: 0,
      endOffset: 0,
      entity: null,
      relation: null,
      selectedEntities: []
    }
  },

  computed: {
    currentLabel() {
      if (this.entity) {
        const label = this.entityLabels.find((label) => label.id === this.entity.label)
        return label
      } else {
        return null
      }
    },

    currentRelationLabel() {
      if (this.relation) {
        const label = this.relationLabels.find((label) => label.id === this.relation.labelId)
        return label
      } else {
        return null
      }
    }
  },

  methods: {
    setOffset(startOffset, endOffset) {
      this.startOffset = startOffset
      this.endOffset = endOffset
    },

    setEntity(entityId) {
      this.entity = this.entities.find((entity) => entity.id === entityId)
    },

    setRelation(relationId) {
      this.relation = this.relations.find((relation) => relation.id === relationId)
    },

    setEntityForRelation(e, entityId) {
      const entity = this.entities.find((entity) => entity.id === entityId)
      const index = this.selectedEntities.findIndex((e) => e.id === entity.id)
      if (index === -1) {
        this.selectedEntities.push(entity)
      } else {
        this.selectedEntities.splice(index, 1)
      }
      if (this.selectedEntities.length === 2) {
        if (this.selectedLabel) {
          this.addRelation(this.selectedLabel.id)
          this.cleanUp()
        } else {
          this.showRelationLabelMenu(e)
        }
      }
    },

    showEntityLabelMenu(e) {
      e.preventDefault()
      this.entityMenuOpened = false
      this.x = e.clientX || e.changedTouches[0].clientX
      this.y = e.clientY || e.changedTouches[0].clientY
      this.$nextTick(() => {
        this.entityMenuOpened = true
      })
    },

    showRelationLabelMenu(e) {
      e.preventDefault()
      this.relationMenuOpened = false
      this.x = e.clientX || e.changedTouches[0].clientX
      this.y = e.clientY || e.changedTouches[0].clientY
      this.$nextTick(() => {
        this.relationMenuOpened = true
      })
    },

    // 选中区域时，判断是否存在快捷键添加（if段），若无则显示添加菜单
    handleAddEvent(e, startOffset, endOffset) {
      this.setOffset(startOffset, endOffset)
      if (this.selectedLabel) {
        this.addOrUpdateEntity(this.selectedLabel.id)
      } else {
        this.showEntityLabelMenu(e)
      }
    },

    onEntityClicked(e, entityId) {
      if (this.relationMode) {
        this.setEntityForRelation(e, entityId)
      } else {
        this.setEntity(entityId)
        this.showEntityLabelMenu(e)
      }
    },

    onRelationClicked(e, relation) {
      this.setRelation(relation.id)
      this.showRelationLabelMenu(e)
    },

    // 点击标签，添加元素
    addOrUpdateEntity(labelId) {
      if (labelId) {
        // 如果是通过点击已有实体触发的，在此前已经记录到 this.entity，直接更新
        if (this.entity) {
          this.updateEntity(labelId)
        } else {
          this.addEntity(labelId)
        }
      } else {
        // 如果没有 labelId，说明是触发列表后点了标签旁的小叉，删除这个实体
        this.deleteEntity(this.entity)
      }
      this.cleanUp()
    },

    addOrUpdateRelation(labelId) {
      if (labelId) {
        if (this.relation) {
          this.updateRelation(labelId)
        } else {
          this.addRelation(labelId)
        }
      } else {
        this.deleteRelation(this.relation)
      }
      this.cleanUp()
    },

    addEntity(labelId) {
      this.$emit('addEntity', this.startOffset, this.endOffset, labelId)
    },

    updateEntity(labelId) {
      this.$emit('click:entity', this.entity.id, labelId)
    },

    deleteEntity(entity) {
      this.$emit('contextmenu:entity', entity.id)
      this.cleanUp()
    },

    cleanUp() {
      this.entityMenuOpened = false
      this.relationMenuOpened = false
      this.entity = null
      this.relation = null
      this.startOffset = 0
      this.endOffset = 0
      this.selectedEntities = []
    },

    addRelation(labelId) {
      const [fromEntity, toEntity] = this.selectedEntities
      this.$emit('addRelation', fromEntity.id, toEntity.id, labelId)
    },

    updateRelation(labelId) {
      this.$emit('click:relation', this.relation.id, labelId)
    },

    deleteRelation(relation) {
      this.$emit('contextmenu:relation', relation.id)
    }
  }
})
</script>
