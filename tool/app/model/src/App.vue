<template>
  <div>
  <el-header>
    <el-steps :space="200" :active="step" finish-status="success" simple>
      <el-step title="上传需求文稿" icon="el-icon-edit"></el-step>
      <el-step title="主体实体抽取" icon="el-icon-plus"></el-step>
      <el-step title="主体关系抽取" icon="el-icon-plus"></el-step>
      <el-step title="意图实体抽取" icon="el-icon-plus"></el-step>
      <el-step title="意图实体填充" icon="el-icon-plus"></el-step>
      <el-step title="完成建模" icon="el-icon-picture"></el-step>
    </el-steps>
  </el-header>


  <!--上传需求文稿-->
  <div v-if="step === 0">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="20" :offset="2">
          <el-input
              v-model="srs"
              :rows="12"
              type="textarea"
              placeholder="Please input requirements text."
          >
          </el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="4" :offset="20">
          <el-button color="#246B29" plain @click="nextToAE">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!--主体实体抽取-->
  <div v-if="step === 1">
    <entity-editor
        :rtl="false"
        :text="this.mockAnnotator.text"
        :entities="this.mockAnnotator.entities"
        :entity-labels="this.mockAnnotator.entityLabels"
        :relations="this.mockAnnotator.relations"
        :relation-labels="this.mockAnnotator.relationLabels"
        :allow-overlapping="false"
        :grapheme-mode="false"
        :selected-label="null"
        :relation-mode="false"
    />
<!--        @addEntity="addSpan"-->
<!--        @addRelation="addRelation"-->
<!--        @click:entity="updateSpan"-->
<!--        @click:relation="updateRelation"-->
<!--        @contextmenu:entity="deleteSpan"-->
<!--        @contextmenu:relation="deleteRelation"-->

  </div>

  <!--主体关系抽取-->
  <div v-if="step === 2">

  </div>

  <!--意图实体抽取-->
  <div v-if="step === 3">

  </div>

  <!--意图实体填充-->
  <div v-if="step === 4">

  </div>

  <!--完成建模-->
  <div v-if="step === 5">

  </div>
  </div>
</template>

<script>
import EntityEditor from "@/components/EntityEditor"

export default {
  name: 'App',
  components: {
    EntityEditor
  },
  data() {
    return {
      step: 0,
      srs: '',
      mockAnnotator: {
        relationTypes: [],
        enableAutoLabeling: false,
        rtl: false,
        selectedLabelIndex: null,
        progress: {},
        relationMode: false,
        text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance. However, at U University, no system can be used directly by teachers who need to borrow classrooms.",
        entities: [{
          id: 0,
          label: 0,
          user: 0,
          startOffset: 0,
          endOffset: 11
        }],
        entityLabels: [{id:0, text:"Role", prefixKey:null, suffixKey: null, backgroundColor: '#66ccff', textColor:'#ccbbaa'}],
        relations: [],
        relationLabels: [],
        selectedEntities: []
      }
    }
  },
  methods: {
    nextToAE() {
      this.step++;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
