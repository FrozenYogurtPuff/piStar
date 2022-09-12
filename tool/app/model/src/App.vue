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
        <el-col :span="16" :offset="4">
          <el-input
              v-model="text"
              :rows="12"
              type="textarea"
              placeholder="请输入需求文本"
          >
          </el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="18">
          <el-button color="#246B29" plain @click="nextToAE">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!-- AE 主体实体抽取-->
  <div v-if="step === 1">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <entity-editor data-app
              :rtl="false"
              :text="this.text"
              :entities="this.mockAnnotator.AE.entities"
              :entity-labels="this.mockAnnotator.AE.entityLabels"
              :relations="this.mockAnnotator.AE.relations"
              :relation-labels="this.mockAnnotator.AE.relationLabels"
              :allow-overlapping="false"
              :grapheme-mode="false"
              :selected-label="null"
              :relation-mode="false"
              @addEntity="handleAEAddSpan"
              @click:entity="handleAEEntityChange"
              @contextmenu:entity="handleAEDeleteSpan"
          />
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="16">
          <el-button color="#246B29" plain @click="prevToBegin">
            上一步
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToAR">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!-- AR 主体关系抽取-->
  <div v-if="step === 2">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <entity-editor data-app
            :rtl="false"
            :text="this.text"
            :entities="this.mockAnnotator.AE.entities"
            :entity-labels="this.mockAnnotator.AE.entityLabels"
            :relations="this.mockAnnotator.AR.relations"
            :relation-labels="this.mockAnnotator.AR.relationLabels"
            :allow-overlapping="false"
            :grapheme-mode="false"
            :selected-label="null"
            :relation-mode="true"
            @addRelation="handleARAddRelation"
            @click:relation="updateARRelation"
            @contextmenu:relation="deleteARRelation"
          />
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="16">
          <el-button color="#246B29" plain @click="prevToAE">
            上一步
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToIE">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!-- IE 意图实体抽取-->
  <div v-if="step === 3">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <entity-editor data-app
            :rtl="false"
            :text="this.text"
            :entities="this.mockAnnotator.IE.entities"
            :entity-labels="this.mockAnnotator.IE.entityLabels"
            :relations="this.mockAnnotator.IE.relations"
            :relation-labels="this.mockAnnotator.IE.relationLabels"
            :allow-overlapping="false"
            :grapheme-mode="false"
            :selected-label="null"
            :relation-mode="this.mockAnnotator.IE.switchRelation"
            @addEntity="handleIEAddSpan"
            @addRelation="handleIEAddRelation"
            @click:entity="handleIEEntityChange"
            @contextmenu:entity="handleIEDeleteSpan"
            @contextmenu:relation="handleIEDeleteRelation"
          />
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="4" :offset="4">
          <el-switch
              style="display: block"
              v-model="mockAnnotator.IE.switchRelation"
              active-color="#5A9CF8"
              inactive-color="#5A9CF8"
              active-text="添加关系"
              inactive-text="添加主体">
          </el-switch>
        </el-col>
        <el-col :span="2" :offset="10">
          <el-button color="#246B29" plain @click="prevToAR">
            上一步
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToII">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!-- II 意图实体填充-->
  <div v-if="step === 4">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          请选取对应的意图进行安置：
        </el-col>
      </el-row>
      <div v-for="item in mockAnnotator.II.phrases" :key='item.id'>
        <el-row :gutter="20">
          <el-col :span="3" :offset="6">
            <el-input
              v-model="item.text"
              :disabled="true">
            </el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-select v-model="item.ans" placeholder="请选择">
              <el-option
                  v-for="item in mockAnnotator.II.options"
                  :key="item.rid"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="16">
          <el-button color="#246B29" plain @click="prevToIE">
            上一步
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToFin">
            下一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>

  <!--完成建模-->
  <div v-if="step === 5">
    <el-main>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          请确认您要生成的iStar模型：
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          实体识别
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-table
              :data="entityTable"
              style="width: 100%">
            <el-table-column
                prop="type"
                label="类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          关系识别
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-table
              :data="relationTable"
              style="width: 100%">
            <el-table-column
                prop="type"
                label="类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="src"
                label="源自"
                width="180">
            </el-table-column>
            <el-table-column
                prop="dest"
                label="目的"
                width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          意图安置
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-table
              :data="intentionTable"
              style="width: 100%">
            <el-table-column
                prop="type"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="类型"
                width="180">
            </el-table-column>
            <el-table-column
                prop="dest"
                label="目标"
                width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="18">
          <el-button color="#246B29" plain @click="prevToII">
            上一步
          </el-button>
        </el-col>
      </el-row>
    </el-footer>
  </div>
  </div>
</template>

<script>
import EntityEditor from "@/components/EntityEditor"
import axios from "axios";

export default {
  name: 'App',
  components: {
    EntityEditor
  },
  data() {
    return {
      step: 0,
      text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance.",
      entityTable: [{
        type: 'Role',
        name: 'The teacher',
      }, {
        type: 'Agent',
        name: 'Anna',
      }, {
        type: 'Role',
        name: 'The headteacher',
      }, {
        type: 'Intention',
        name: 'do homework',
      }, {
        type: 'Intention',
        name: 'borrow classroom',
      }],
      relationTable: [{
        type: 'dependency',
        src: 'The teacher',
        dest: 'Anna'
      }],
      intentionTable: [{
        name: 'do homework',
        type: 'dependency',
        dest: 'The teacher - Anna',
      }, {
        name: 'borrow classroom',
        type: 'inside',
        dest: 'The headteacher'
      }],
      mockAnnotator: {
        AE: {
          relationTypes: [],
          enableAutoLabeling: false,
          rtl: false,
          selectedLabelIndex: null,
          progress: {},
          relationMode: false,
          entities: [{
            id: 1,
            label: 1,
            user: 0,
            startOffset: 0,
            endOffset: 11
          }, {
            id: 2,
            label: 2,
            user: 0,
            startOffset: 17,
            endOffset: 21
          }, {
            id: 3,
            label: 1,
            user: 0,
            startOffset: 42,
            endOffset: 57
          },],
          entityLabels: [{
            id: 1,
            text: "Role",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#66ccff',
            textColor: '#ccbbaa'
          }, {
            id: 2,
            text: "Agent",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#ffcc66',
            textColor: '#ccbbaa'
          }],
          relations: [],
          relationLabels: [],
          selectedEntities: []
        },
        AR: {
          relationTypes: [],
          enableAutoLabeling: false,
          rtl: false,
          selectedLabelIndex: null,
          progress: {},
          relationMode: false,
          relations: [{
            id: 123,
            fromId: 1,
            toId: 2,
            labelId: 11
          }],
          relationLabels: [{
            id: 11,
            text: "Dependency",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#9977dd',
            textColor: '#ccbbaa'
          },{
            id: 12,
            text: "is-a",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#66ccff',
            textColor: '#ccbbaa'
          },{
            id: 13,
            text: "participate-in",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#66ccff',
            textColor: '#ccbbaa'
          }],
          selectedEntities: []
        },
        IE: {
          switchRelation: false,
          relationTypes: [],
          enableAutoLabeling: false,
          rtl: false,
          selectedLabelIndex: null,
          progress: {},
          relationMode: false,
          entities: [{
            id: 1,
            label: 101,
            user: 0,
            startOffset: 25,
            endOffset: 27
          }, {
            id: 2,
            label: 102,
            user: 0,
            startOffset: 32,
            endOffset: 40
          }, {
            id: 3,
            label: 101,
            user: 0,
            startOffset: 67,
            endOffset: 73
          }, {
            id: 4,
            label: 102,
            user: 0,
            startOffset: 78,
            endOffset: 87
          }],
          entityLabels: [{
            id: 1,
            text: "Verb",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#66ffcc',
            textColor: '#ccbbaa'
          }, {
            id: 2,
            text: "Obj",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#eeff22',
            textColor: '#ccbbaa'
          }],
          relations: [{
            id: 123,
            fromId: 1,
            toId: 2,
            labelId: 11
          }, {
            id: 124,
            fromId: 3,
            toId: 4,
            labelId: 11
          }],
          relationLabels: [{
            id: 11,
            text: "Verb-Obj",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#548631',
            textColor: '#ccbbaa'
          }],
          selectedEntities: []
        },
        II: {
          options: [{
            value: 0,
            type: 'dependency',
            rid: 1,
            label: 'The teacher - Anna',
          }, {
            value: 1,
            label: 'The teacher'
          }, {
            value: 2,
            label: 'Anna'
          }, {
            value: 3,
            label: 'The headteacher'
          }],
          phrases: [{
            id: 0,
            text: 'do homework',
            ans: 0
          }]
        }
      }
    }
  },
  methods: {
    nextToAE() {
      if (this.step !== 0) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.post("http://127.0.0.1:5050/ae", {
        // text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance."
        text: this.text
      }).then(response => {
        let data = response.data
        this.mockAnnotator.AE.entities = []
        for (let idx in data) {
          let item = data[idx]
          let tag_id = (item[0] === "Role") ? 1 : 2;
          this.mockAnnotator.AE.entities.push({
            id: idx,
            label: tag_id,
            user: 0,
            startOffset: item[1],
            endOffset: item[2]
          })
        }
        loading.close();
        this.step++;
      })
    },
    prevToBegin() {
      if (this.step !== 1) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.step--;
      }, 200);
    },
    nextToAR() {
      if (this.step !== 1) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.post("http://127.0.0.1:5050/ar", {
        // text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance."
        text: this.text,
        entity: this.mockAnnotator.AE.entities
      }).then(response => {
        let data = response.data
        // console.log(data)
        this.mockAnnotator.AR.relations = []
        for (let key in data) {
          let item = data[key]
          let aid = item[0]
          let bid = item[1]
          let lid = item[2]
          this.mockAnnotator.AR.relations.push({
            id: aid * 10 + bid,
            fromId: aid,
            toId: bid,
            labelId: lid
          })
        }

        // console.log(this.mockAnnotator.AR.relations)
        loading.close();
        this.step++;
      })
    },
    prevToAE() {
      if (this.step !== 2) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.step--;
      }, 200);
    },
    nextToIE() {
      if (this.step !== 2) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axios.post("http://127.0.0.1:5050/ie", {
        // text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance."
        text: this.text
      }).then(response => {
        let data = response.data
        // console.log(data)
        this.mockAnnotator.IE.entities = []
        this.mockAnnotator.IE.relations = []
        let cur_idx = 1;
        for (let idx in data) {
          let pair = data[idx]
          let verb_idx = -1
          // console.log(idx)
          // console.log(pair)
          for (let cur in pair) {
            let item = pair[cur]
            let tag_id = (item[0] === "Core") ? 1 : 2;
            if (tag_id === 1) {
              verb_idx = cur_idx;
            }
            this.mockAnnotator.IE.entities.push({
              id: cur_idx,
              label: tag_id,
              user: 0,
              startOffset: item[1],
              endOffset: item[2]
            })
            if (tag_id === 2) {
              // console.log("!" + verb_idx + " " + cur_idx)
              this.mockAnnotator.IE.relations.push({
                id: cur_idx,
                fromId: verb_idx,
                toId: cur_idx,
                labelId: 11
              })
            }
            cur_idx++;
          }
        }
        // console.log(this.mockAnnotator.IE.entities)
        loading.close();
        this.step++;
      })
    },
    prevToAR() {
      if (this.step !== 3) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.step--;
      }, 200);
    },
    nextToII() {
      if (this.step !== 3) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.mockAnnotator.II.phrases = []
      for (let key in this.mockAnnotator.IE.relations) {
        let item = this.mockAnnotator.IE.relations[key]
        let text = ""
        let value = item.id
        this.mockAnnotator.IE.entities.forEach(elem => {
          if (elem.id === item.fromId) {
            text += (this.text.substring(elem.startOffset, elem.endOffset) + " ")
          }
        })
        this.mockAnnotator.IE.entities.forEach(elem => {
          if (elem.id === item.toId) {
            text += this.text.substring(elem.startOffset, elem.endOffset)
          }
        })
        // console.log(text)
        this.mockAnnotator.II.phrases.push({
          id: value,
          text: text,
          ans: 0
        })
      }

      this.mockAnnotator.II.options = []
      let value = 0
      for (let key in this.mockAnnotator.AR.relations) {
        let item = this.mockAnnotator.AR.relations[key]
        if (item.labelId === 11) {
          let text = ""
          this.mockAnnotator.AE.entities.forEach(elem => {
            if (elem.id === item.fromId) {
              text += (this.text.substring(elem.startOffset, elem.endOffset) + " - ")
            }
          })
          this.mockAnnotator.AE.entities.forEach(elem => {
            if (elem.id === item.toId) {
              text += this.text.substring(elem.startOffset, elem.endOffset)
            }
          })
          this.mockAnnotator.II.options.push({
            value: value,
            type: 'dependency',
            rid: item.id,
            label: text,
          })
          value += 1
        }
      }
      for (let key in this.mockAnnotator.AE.entities) {
        let item = this.mockAnnotator.AE.entities[key]
        this.mockAnnotator.II.options.push({
          value: value,
          type: 'inside',
          rid: item.id,
          label: this.text.substring(item.startOffset, item.endOffset),
        })
        value += 1
      }

      loading.close();
      this.step++;
    },
    prevToIE() {
      if (this.step !== 4) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.step--;
      }, 200);
    },
    nextToFin() {
      if (this.step !== 4) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // 构建实体识别列表
      // this.mockAnnotator.II.phrases
      // this.mockAnnotator.AE.entities
      this.entityTable = []
      this.mockAnnotator.AE.entities.forEach((elem) => {
        this.entityTable.push({
          type: elem.label === 1 ? "Role" : "Agent",
          name: this.text.substring(elem.startOffset, elem.endOffset)
        })
      })
      this.mockAnnotator.II.phrases.forEach((elem) => {
        this.entityTable.push({
          type: "Intention",
          name: elem.text
        })
      })

      // 构建关系识别列表
      this.relationTable = []
      this.mockAnnotator.AR.relations.forEach((elem) => {
        let start = this.mockAnnotator.AE.entities.find(el => el.id === elem.fromId)
        let end = this.mockAnnotator.AE.entities.find(el => el.id === elem.toId)
        let type = elem.labelId === 11 ? "Dependency" : elem.labelId === 12 ? "is-a" : "participate-in"
        this.relationTable.push({
          type: type,
          src: this.text.substring(start.startOffset, start.endOffset),
          dest: this.text.substring(end.startOffset, end.endOffset)
        })
      })

      // 构建意图安置列表
      this.intentionTable = []
      this.mockAnnotator.II.phrases.forEach((elem) => {
        let text = elem.text
        let el = this.mockAnnotator.II.options.find(el => el.value === elem.ans)
        this.intentionTable.push({
          name: text,
          type: el.type,
          dest: el.label,
        })
      })

      loading.close();
      this.step++;

      window.parent.postMessage({
        ...this.mockAnnotator,
        text: this.text
      }, '*');
    },
    prevToII() {
      if (this.step !== 5) {
        throw "阶段与步骤数目不匹配"
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.step--;
      }, 200);
    },
    handleAEEntityChange(aId, lId) {
      this.mockAnnotator.AE.entities.forEach(elem => {
        if (elem.id === aId) {
          elem.label = lId;
        }
      })
    },
    handleAEDeleteSpan(aId) {
      this.mockAnnotator.AE.entities.forEach((elem, index, object) => {
        if (elem.id === aId) {
          object.splice(index, 1);
        }
      })
    },
    handleAEAddSpan(start, end, lId) {
      let max_idx = this.mockAnnotator.AE.entities.length;
      this.mockAnnotator.AE.entities.forEach((elem) => {
        if (elem.id > max_idx) {
          max_idx = elem.id
        }
      })
      this.mockAnnotator.AE.entities.push({
        id: max_idx,
        label: lId,
        user: 0,
        startOffset: start,
        endOffset: end
      })
    },
    handleIEEntityChange(aId, lId) {
      this.mockAnnotator.IE.entities.forEach(elem => {
        if (elem.id === aId) {
          elem.label = lId;
        }
      })
    },
    handleIEDeleteSpan(aId) {
      this.mockAnnotator.IE.entities.forEach((elem, index, object) => {
        if (elem.id === aId) {
          object.splice(index, 1);
        }
      })
      this.mockAnnotator.IE.relations.forEach((elem, index, object) => {
        if (elem.fromId === aId || elem.toId === aId) {
          object.splice(index, 1);
        }
      })
    },
    handleIEAddSpan(start, end, lId) {
      // console.log(this.mockAnnotator.IE.entities)
      let max_idx = this.mockAnnotator.IE.entities.length;
      this.mockAnnotator.IE.entities.forEach((elem) => {
        if (elem.id > max_idx) {
          max_idx = elem.id
        }
      })
      this.mockAnnotator.IE.entities.push({
        id: max_idx + 1,
        label: lId,
        user: 0,
        startOffset: start,
        endOffset: end
      })
      // console.log(this.mockAnnotator.IE.entities)
    },
    handleIEAddRelation(start, end, lId) {
      // console.log(this.mockAnnotator.IE.entities)
      this.mockAnnotator.IE.entities.forEach((elem) => {
        if (elem.id === start && elem.label !== 1) {
          throw 'Please start with Verb'
        }
        if (elem.id === end && elem.label !== 2) {
          throw 'Please end with Obj'
        }
      })
      this.mockAnnotator.IE.relations.push({
        id: end,
        fromId: start,
        toId: end,
        labelId: lId
      })
      // console.log(this.mockAnnotator.IE.relations)
    },
    handleARAddRelation(start, end, lId) {
      // console.log(this.mockAnnotator.AE.entities)
      this.mockAnnotator.AR.relations.push({
        id: start * 10 + end,
        fromId: start,
        toId: end,
        labelId: lId
      })
      // console.log(this.mockAnnotator.AR.relations)
    },
    updateARRelation(aId, lId) {
      this.mockAnnotator.AR.relations.forEach(elem => {
        if (elem.id === aId) {
          elem.labelId = lId;
        }
      })
    },
    deleteARRelation(aId) {
      this.mockAnnotator.AR.relations.forEach((elem, index, object) => {
        if (elem.id === aId) {
          object.splice(index, 1);
        }
      })
    },
    handleIEDeleteRelation(aId) {
      this.mockAnnotator.IE.relations.forEach((elem, index, object) => {
        if (elem.id === aId) {
          object.splice(index, 1);
        }
      })
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

div {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
