<template>
  <div>
  <el-header>
    <el-steps :space="200" :active="step" finish-status="success" simple>
      <el-step title="Input Sentence" icon="el-icon-edit"></el-step>
      <el-step title="Actor Entity" icon="el-icon-plus"></el-step>
      <el-step title="Actor Relation" icon="el-icon-plus"></el-step>
      <el-step title="Intention Entity" icon="el-icon-plus"></el-step>
      <el-step title="Intention Matching" icon="el-icon-plus"></el-step>
      <el-step title="Finish" icon="el-icon-picture"></el-step>
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
              placeholder="Please input req text..."
          >
          </el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="18">
          <el-button color="#246B29" plain @click="nextToAE">
            Next
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
            Back
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToAR">
            Next
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
            Back
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToIE">
            Next
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
<!--          <entity-editor data-app-->
<!--            :rtl="false"-->
<!--            :text="this.text"-->
<!--            :entities="this.mockAnnotator.IE.entities"-->
<!--            :entity-labels="this.mockAnnotator.IE.entityLabels"-->
<!--            :relations="this.mockAnnotator.IE.relations"-->
<!--            :relation-labels="this.mockAnnotator.IE.relationLabels"-->
<!--            :allow-overlapping="false"-->
<!--            :grapheme-mode="false"-->
<!--            :selected-label="null"-->
<!--            :relation-mode="this.mockAnnotator.IE.switchRelation"-->
<!--            @addEntity="handleIEAddSpan"-->
<!--            @addRelation="handleIEAddRelation"-->
<!--            @click:entity="handleIEEntityChange"-->
<!--            @contextmenu:entity="handleIEDeleteSpan"-->
<!--            @contextmenu:relation="handleIEDeleteRelation"-->
<!--          />-->
          <entity-editor data-app
              :rtl="false"
              :text="this.text"
              :entities="this.mockAnnotator.IE.entities"
              :entity-labels="this.mockAnnotator.IE.entityLabels"
              :relations="this.mockAnnotator.IE.relations"
              :relation-labels="this.mockAnnotator.IE.relationLabels"
              :allow-overlapping="true"
              :grapheme-mode="false"
              :selected-label="null"
              :relation-mode="false"
              @addEntity="handleIEAddSpan"
              @click:entity="handleIEEntityChange"
              @contextmenu:entity="handleIEDeleteSpan"
          />
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="16">
          <el-button color="#246B29" plain @click="prevToAR">
            Back
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToII">
            Next
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
          {{text}}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          Please match corresponding intentions（texts are editable）：
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <div v-for="item in mockAnnotator.II.select" :key='item.id'>
        <el-row :gutter="20">
          <el-col :span="5" :offset="6">
            <el-select allow-create filterable v-model="item.pid" placeholder="请选择（可编辑）" style="width:100%">
              <el-option
                  v-for="it in mockAnnotator.II.phrases"
                  :key="it.id"
                  :label="it.text"
                  :value="it.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5" :offset="0">
            <el-select v-model="item.oid" placeholder="请选择" style="width:100%">
              <el-option
                  v-for="it in mockAnnotator.II.options"
                  :key="it.rid"
                  :label="it.label"
                  :value="it.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" :offset="0">
             <el-button plain @click="delIISelect(item.id)">
              x
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
        <el-row :gutter="20">
          <el-col :span="7" :offset="11">
            <el-button plain @click="addIISelect">
              +
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer>
      <el-row :gutter="20">
        <el-col :span="2" :offset="16">
          <el-button color="#246B29" plain @click="prevToIE">
            Back
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button color="#246B29" plain @click="nextToFin">
            Next
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
          Please confirm the iStar model:
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          &NonBreakingSpace;
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          Entity extraction
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
          Relation extraction
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-table
              :data="relationTable"
              style="width: 100%">
            <el-table-column
                prop="type"
                label="Type"
                width="180">
            </el-table-column>
            <el-table-column
                prop="src"
                label="From"
                width="180">
            </el-table-column>
            <el-table-column
                prop="dest"
                label="To"
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
          Intention matching
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16" :offset="4">
          <el-table
              :data="intentionTable"
              style="width: 100%">
            <el-table-column
                prop="name"
                label="Name"
                width="180">
            </el-table-column>
            <el-table-column
                prop="pType"
                label="Intention type"
                width="180">
            </el-table-column>
            <el-table-column
                prop="dType"
                label="Destination Type"
                width="180">
            </el-table-column>
            <el-table-column
                prop="dest"
                label="Destination"
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
            Back
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
        pType: 'Goal',
        dType: 'dependency',
        dest: 'The teacher - Anna',
      }, {
        name: 'borrow classroom',
        pType: 'Goal',
        dType: 'inside',
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
            text: "Goal",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#66ffcc',
            textColor: '#ccbbaa'
          }, {
            id: 2,
            text: "Quality",
            prefixKey: null,
            suffixKey: null,
            backgroundColor: '#eeff22',
            textColor: '#ccbbaa'
          }],
          // relations: [{
          //   id: 123,
          //   fromId: 1,
          //   toId: 2,
          //   labelId: 11
          // }, {
          //   id: 124,
          //   fromId: 3,
          //   toId: 4,
          //   labelId: 11
          // }],
          // relationLabels: [{
          //   id: 11,
          //   text: "Verb-Obj",
          //   prefixKey: null,
          //   suffixKey: null,
          //   backgroundColor: '#548631',
          //   textColor: '#ccbbaa'
          // }],
          relations: [],
          relationLabels: [],
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
            type: 'inside',
            rid: 1,
            label: 'The teacher'
          }, {
            value: 2,
            type: 'inside',
            rid: 2,
            label: 'Anna'
          }, {
            value: 3,
            type: 'inside',
            rid: 3,
            label: 'The headteacher'
          }],
          phrases: [{
            id: 0,
            type: 'Goal',
            text: 'do homework'
          }],
          select: [{
            id: 0,
            pid: 0,
            text: '',
            oid: 0
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
      axios.post("http://" + window.location.hostname + ":5050/ae", {
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
      axios.post("http://" + window.location.hostname + ":5050/ar", {
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

      // If not empty, just use it
        axios.post("http://" + window.location.hostname + ":5050/ie", {
          // text: "The teacher asks Anna to do the homework. The headteacher needs to borrow the classroom in advance."
          text: this.text
        }).then(response => {
          let data = response.data
          this.mockAnnotator.IE.entities = []

          for (let idx in data) {
            let item = data[idx]
            let tag_id = (item[0] === "Goal") ? 1 : 2
            this.mockAnnotator.IE.entities.push({
              id: idx,
              label: tag_id,
              user: 0,
              startOffset: item[1],
              endOffset: item[2]
            })
          }
        })
      loading.close();
      this.step++;
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

      for (let key in this.mockAnnotator.IE.entities) {
        let elem = this.mockAnnotator.IE.entities[key]
        this.mockAnnotator.II.phrases.push({
          id: elem.id,
          type: elem.label === 1 ? "Goal" : "Quality",
          text: this.text.substring(elem.startOffset, elem.endOffset)
        })
      }

      // for (let key in this.mockAnnotator.IE.relations) {
      //   let item = this.mockAnnotator.IE.relations[key]
      //   let text = ""
      //   let value = item.id
      //   this.mockAnnotator.IE.entities.forEach(elem => {
      //     if (elem.id === item.fromId) {
      //       text += (this.text.substring(elem.startOffset, elem.endOffset) + " ")
      //     }
      //   })
      //   this.mockAnnotator.IE.entities.forEach(elem => {
      //     if (elem.id === item.toId) {
      //       text += this.text.substring(elem.startOffset, elem.endOffset)
      //     }
      //   })
      //   // console.log(text)
      //   this.mockAnnotator.II.phrases.push({
      //     id: value,
      //     text: text,
      //   })
      // }



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

      this.mockAnnotator.II.select = []
      let optionLength = this.mockAnnotator.II.options.length
      let phraseLength = this.mockAnnotator.II.phrases.length
      let minLength = optionLength > phraseLength ? phraseLength : optionLength
      for (let i = 0; i < minLength; i++) {
        if (minLength === optionLength) {
          this.mockAnnotator.II.select.push({
            id: i,
            pid: this.mockAnnotator.II.phrases[0].id,
            text: "",
            oid: this.mockAnnotator.II.options[i].value
          })
        } else {
          this.mockAnnotator.II.select.push({
            id: i,
            pid: this.mockAnnotator.II.phrases[i].id,
            text: "",
            oid: this.mockAnnotator.II.options[0].value
          })
        }
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
      this.mockAnnotator.II.select.forEach((elem) => {
        let text
        let pType
        let phrase = this.mockAnnotator.II.phrases.find(el => el.id === elem.pid)
        if (!phrase) {
          text = elem.pid
          pType = 'Goal'
          elem.pid = -1
          elem.text = text
        } else {
          text = phrase.text
          pType = phrase.type
        }

        let option = this.mockAnnotator.II.options.find(el => el.value === elem.oid)
        let dType = option.type
        let dest = option.label

        this.intentionTable.push({
          name: text,
          pType: pType,
          dType: dType,
          dest: dest,
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
        for (let key in this.mockAnnotator.II.select) {
          let item = this.mockAnnotator.II.select[key]
          if (item.pid === -1) {
            item.pid = item.text
          }
        }

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
        id: max_idx + 1,
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
      // this.mockAnnotator.IE.relations.forEach((elem, index, object) => {
      //   if (elem.fromId === aId || elem.toId === aId) {
      //     object.splice(index, 1);
      //   }
      // })
    },
    handleIEAddSpan(start, end, lId) {
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
    },
    // handleIEAddRelation(start, end, lId) {
    //   // console.log(this.mockAnnotator.IE.entities)
    //   this.mockAnnotator.IE.entities.forEach((elem) => {
    //     if (elem.id === start && elem.label !== 1) {
    //       throw 'Please start with Verb'
    //     }
    //     if (elem.id === end && elem.label !== 2) {
    //       throw 'Please end with Obj'
    //     }
    //   })
    //   this.mockAnnotator.IE.relations.push({
    //     id: end,
    //     fromId: start,
    //     toId: end,
    //     labelId: lId
    //   })
    //   // console.log(this.mockAnnotator.IE.relations)
    // },
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
    // handleIEDeleteRelation(aId) {
    //   this.mockAnnotator.IE.relations.forEach((elem, index, object) => {
    //     if (elem.id === aId) {
    //       object.splice(index, 1);
    //     }
    //   })
    // },
    delIISelect(selectId) {
      let index = this.mockAnnotator.II.select.findIndex(elem => elem.id === selectId)
      this.mockAnnotator.II.select.splice(index, 1)
    },
    addIISelect() {
      if (this.mockAnnotator.II.options.length === 0) {
        return;
      }
      if (this.mockAnnotator.II.phrases.length === 0) {
        return;
      }

      let prevId = this.mockAnnotator.II.select.slice(-1)[0].id
      this.mockAnnotator.II.select.push({
        id: prevId + 1,
        pid: this.mockAnnotator.II.phrases[0].id,
        oid: this.mockAnnotator.II.options[0].value,
        text: ""
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

.el-step__title {
  font-size: 14px !important;
}
</style>
