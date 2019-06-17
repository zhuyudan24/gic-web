<template>
  <div class="container-item1 left">
    <div>
      <h1 class="container-title">基础组件</h1>
      <div class="line"></div>

      <div class="compenent">
       <draggable id="list1" @clone='cloneComponent' :list="baseList" class="dragArea" :options="{group:{name:'people', pull:'clone', put:false},'sort': false}">
          <a class="compenent-item" :data-type='item.type' v-for="item in baseList" @click="addComponent(item.type)">{{ item.name }}</a>
       </draggable>
      </div>

    </div>

    <div>
      <h1 class="container-title">功能组件</h1>
      <div class="line"></div>
      <div class="compenent">
        <a class="compenent-item">数据icon</a>
        <a class="compenent-item">进入特权</a>
        <a class="compenent-item">进入集团商户</a>
      </div>
    </div>
  </div>
</template>

<script>
  import * as bases from '../../common/js/basecompents'
  import draggable from 'vuedraggable'
  export default {
    name: "customAddLeft",
    data() {
      return {
        baseList: bases.baseList,
        mainList: bases.mainList,
        mallList: bases.mallList,
        saleList: bases.saleList
      }
    },
    methods: {
      cloneComponent(evt) {
        this.baseList = [
          {
            type: 'one',
            name: '图片广告',
            template: '1',
            isSpace: 'Y',
            imgList: [
              {
                imgUrl: '',
                imglink: '',
                crowd: ''
              }
            ],
            linkUrl: ''
          },
          {
            type: 'two',
            name: '魔方',
            template: '1',
            isSpace: 'Y',
            imgList: [
              {
                imgUrl: '',
                imglink: '',
                crowd: ''
              }
            ],
            crowd: {
              type: 'Y',
              condition: ''
            },
            linkUrl: ''
          },
          {
            type: 'three',
            name: '文本',
            content: '',
            textcolor: '#333',
            bgcolor: '#fff',
            showPosition: '',
            isSpace: 'Y',
            crowd: {
              type: 'Y',
              condition: ''
            }
          },
          {
            type: 'four',
            name: '横栏',
            template: 'one',
            tip: 'true',
            textcolor: '#333',
            bgcolor: '#fff',
            imgList: [
              {
                label: '',
                imgUrl: '',
                linkUrl: '',
                crowd: {
                  type: 'Y',
                  condition: ''
                }
              }
            ]
          },
          {
            type: 'five',
            name: '辅助线',
            color: '#333',
            margin: '10px',
            style: 'solid'
          },
          {
            type: 'six',
            name: '辅助空白',
            height: '10'
          }
        ];
        let origEl = evt.item;
        let type = origEl.dataset.type;
        this.$emit('getType',type);
      },
      addComponent(type) {
        this.$emit('addComponent',type)
      }
    },
    components: {
        draggable
    }
  }
</script>

