<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow" @listClick="listClick" :selectionList.sync="selectionList"
                          :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}"
                          @getList="getList" :tableDataInfo="tableDataInfo"
                          :pagingData.sync="pagingData"></ldl-table-pagination>
    <ldlControlWindow :bottomHeight.sync="bottomHeight" ref="bottomHeight">
      <el-tabs type="border-card" v-model="tabPaneValue" class="ldlTab" @tab-click="changeTab"
               style="height: calc(100% - 4px)">
        <el-tab-pane label="商品信息" name="goodsInfo1" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                align="center"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="sku_name"
                align="center"
                label="规格">
            </el-table-column>
            <el-table-column
                prop="price"
                align="center"
                label="价格">
            </el-table-column>
            <!--           <el-table-column-->
            <!--               prop="cover_link_img"-->
            <!--               label="商品的封面图">-->
            <!--             <template slot-scope="scope">-->
            <!--               <el-image-->
            <!--                   style="width: 40px; height: 40px"-->
            <!--                   :src="scope.row.cover_link_img"-->
            <!--                   :preview-src-list="[scope.row.cover_link_img]">-->
            <!--               </el-image>-->
            <!--             </template>-->
            <!--           </el-table-column>-->
            <el-table-column
                prop="number"
                align="center"
                width="80"
                label="商品数量">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收件人信息" name="goodsInfo2" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="sj_name"
                align="center"
                label="收件人名称">
            </el-table-column>
            <el-table-column
                prop="sj_phone"
                align="center"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="province"
                align="center"
                label="省">
            </el-table-column>
            <el-table-column
                prop="city"
                align="center"
                label="市">
            </el-table-column>
            <el-table-column
                prop="area"
                align="center"
                label="区">
            </el-table-column>
            <el-table-column
                prop="address"
                align="center"
                label="地址">
            </el-table-column>
            <el-table-column
                prop="detail_address"
                align="center"
                label="复制信息">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="订单信息" name="goodsInfo3" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="order_code"
                align="center"
                label="订单编号">
            </el-table-column>
            <el-table-column
                prop="appoint_expressid"
                align="center"
                label="指定快递公司">
            </el-table-column>
            <el-table-column
                prop="user_id"
                align="center"
                label="成交员工">
            </el-table-column>
            <el-table-column
                prop="company_id"
                align="center"
                label="成交单位">
            </el-table-column>
            <el-table-column
                prop="ke_user_id"
                align="center"
                label="客服员工">
            </el-table-column>
            <el-table-column
                prop="ke_company_id"
                align="center"
                label="客服单位">
            </el-table-column>
            <el-table-column
                prop="order_mold"
                align="center"
                label="订单类型">
            </el-table-column>
            <el-table-column
                prop="ke_zf_fee"
                align="center"
                label="客户支付金额">
            </el-table-column>
            <el-table-column
                prop="order_type"
                align="center"
                label="订单来源">
              <template slot-scope="scope">
                <!--                 2021年2月25日17:35:52 吴老板说的和文档相反-->
                <el-tag v-if="scope.row.order_type===2">小程序订单</el-tag>
                <el-tag v-if="scope.row.order_type===1" type="success">app订单</el-tag>
              </template>
            </el-table-column>
            <el-table-column
                prop="is_vip"
                align="center"
                label="是否是vip订单">
            </el-table-column>
            <el-table-column
                prop="status_ex"
                align="center"
                label="订单状态">
            </el-table-column>
            <el-table-column
                prop="create_time"
                align="center"
                label="下单时间">
            </el-table-column>
            <el-table-column
                prop="pay_time"
                align="center"
                label="支付时间">
            </el-table-column>
            <el-table-column
                prop="pay_type"
                align="center"
                label="支付方式">
            </el-table-column>
            <el-table-column
                prop="order_remarks"
                align="center"
                label="订单备注">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="操作信息" name="goodsInfo5" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="user_id"
                align="center"
                label="操作员工">
            </el-table-column>
            <el-table-column
                prop="operation_type"
                align="center"
                label="操作类型">
            </el-table-column>
            <el-table-column
                prop="operation_remarks"
                align="center"
                label="备注信息">
            </el-table-column>
            <el-table-column
                prop="create_time"
                align="center"
                label="操作时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="电子卡信息" name="goodsInfo6" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                align="center"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="sku_name"
                align="center"
                label="商品规格名称">
            </el-table-column>
            <el-table-column
                prop="card_id"
                align="center"
                label="电子卡号">
            </el-table-column>
            <el-table-column
                prop="create_time"
                align="center"
                label="扫码时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="验货信息" name="goodsInfo7" :disabled="!selectRow" style="height:calc(100% - 4px)">
          <el-table
              :data="bottomList[tabPaneValue]"
              border
              size="mini"
              height="100%"
              style="width: 100%;">
            <el-table-column
                prop="product_name"
                align="center"
                label="商品名称">
            </el-table-column>
            <el-table-column
                prop="sku_name"
                align="center"
                label="商品规格名称">
            </el-table-column>
            <el-table-column
                prop="a_fake_17"
                align="center"
                label="防伪码号">
            </el-table-column>
            <el-table-column
                prop="status"
                align="center"
                label="防伪码状态">
            </el-table-column>
            <el-table-column
                prop="first_queryTime"
                align="center"
                label="首次查询时间">
            </el-table-column>
            <el-table-column
                prop="s_number"
                align="center"
                label="查询次数">
            </el-table-column>
            <el-table-column
                prop="create_time"
                align="center"
                label="扫码时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ldlControlWindow>
    <!-- 同步发货 -->
    <el-dialog title="同步发货" :visible.sync="syncDev" width="500px" :close-on-click-modal="false">
      <el-form
          ref="syncdevForm"
          label-position="right"
          label-width="80px"
          :model="syncdevForm"
          size="mini"
      >
        <el-form-item label="包装箱型" prop="bz_xin" :rules="[{ required: true, message: '包装箱型不能为空'}]">
          <el-input v-model="syncdevForm.bz_xin" disabled/>
        </el-form-item>
        <el-form-item label="估重" prop="guzong">
          <el-input v-model="syncdevForm.guzong" :disabled="true">
            <template slot="append">克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实重" prop="shizong" :rules="[{ required: true, message: '实重不能为空'}]">
          <el-input ref="customerInput" v-model="syncdevForm.shizong" @focus="getInputFocus($event)"
                    @keyup.enter.native="syncdevFormSave(syncdevForm)">
            <template slot="append">克</template>
          </el-input>
        </el-form-item>
        <el-form-item label="快递费用">
          <el-input v-model="syncdevForm.ps_fee"/>
          <!-- <el-select v-model="syncdevForm.ps_fee" filterable>
            <el-option
              v-for="(item,index) in expressCompany"
              :key="index"
              :label="item.kdname"
              :value="item.expressId">
            </el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="客户备注">
          {{ syncdevForm.fh_remarks ? syncdevForm.fh_remarks : '无' }}
        </el-form-item>
        <el-form-item label="发货备注">
          <el-input v-model="syncdevForm.remarks" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="syncDev = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="syncdevFormSave(syncdevForm)">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 同步发货 -->
    <!-- 批量签收 -->
    <el-dialog title="订单签收" :visible.sync="signModal" width="450px" :close-on-click-modal="false">
      <el-form
          ref="SignForm"
          label-position="right"
          label-width="80px"
          :model="SignForm"
          size="mini"
      >
        <el-form-item label="审单备注">
          <el-input v-model="SignForm.remarks" type="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="signModal = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="SignSave(SignForm)">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 批量签收 -->
    <!-- 批量操作成功弹窗 -->
    <el-dialog title="操作成功" :visible.sync="successModal" :modal="false" center width="500px">
      <div class="successModal">
        <el-alert
            v-for="(items,index) in successData"
            :key="index"
            :closable="false"
            :title="items.msg"
            :type="items.code"
            style="margin-bottom:6px;"
            show-icon
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" plain type="info" round @click="successModal = false">朕知道了</el-button>
      </span>
    </el-dialog>
    <!-- 批量操作成功弹窗 -->

  </div>
</template>

<script>

import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";

import ldlControlWindow from "@/components/ldlControlWindow";
import {
  d_list,
  getCloudNumber,
  code_deliver,
  printPlhuo,
  changePlhuoStatus,
  p_footer,
  batchSign
} from "@/api/DeliveryManage/DeliverGoodsManage/SynchroDeliver";

export default {
  name: "SynchroDeliver",
  data() {
    return {
      cc: 0,
      type: 0,
      syncDev: false,
      syncdevForm: {},
      bottomList: {},
      tabPaneValue: 'goodsInfo1',
      socket: null,
      /**必要参数*/
      selectionList: undefined,//多选
      selectRow: undefined, //选中行
      pagingData: undefined,//getList的传参
      bottomHeight: '30%',//底部高度
      buttonBoxState: true,//开启按钮行的状态
      tableDataInfo: { //表格信息
        dataListInfo: [
          {type: 'selection', width: 35},
          {prop: 'plfahuo_code', label: '发货单号', width: 150},
          {
            prop: 'intercept_status',
            label: '是否拦截',
            type: 'tag',
            data: [{type: '', key: 1, name: '未拦截'}, {type: 'danger', key: 2, name: '已拦截'}],
          },
          {prop: 'plfahuo_status', label: '状态',},
          {
            prop: 'is_after_sale',
            label: '是否售后申请',
            type: 'tag',
            data: [{type: 'danger', key: 1, name: '否'}, {type: 'success', key: 2, name: '是'}]
          },
          {prop: 'create_time', label: '创建时间', type: "date", width: 140, sortable: "custom",},
          {prop: 'guzong', label: '估重', sortable: "custom"},
          {prop: 'shizong', label: '实重', sortable: "custom"},
          {prop: 'bz_xin', label: '包货箱型',},
          {prop: 'product_number', label: '商品数量', sortable: "custom"},
          {prop: 'ps_fee', label: '配送费用', sortable: "custom"},
          {prop: 'companyName', label: '配送单位',},
          {prop: 'sj_name', label: '收件人姓名',},
          {prop: 'sj_phone', label: '收件人手机',},
          {prop: 'province', label: '省',},
          {prop: 'city', label: '市',},
          {prop: 'district', label: '区',},
          {prop: 'detail_address', label: '详细地址',},
          {
            prop: 'plfahuo_characteristic',
            type: 'tag',
            label: '发货单标识',
            data: [{type: 'danger', key: 2, name: '拆分单'}, {type: 'success', key: 3, name: '合并单'}],
          },
          {
            prop: 'express_status',
            type: 'tag',
            label: '快递单打印状态',
            width: 100,
            data: [{type: 'info', key: 1, name: '未打印'}, {type: '', key: 2, name: '打印成功'}, {
              type: 'danger',
              key: 3,
              name: '打印失败'
            }],
          },
          {
            prop: 'qingdan_status',
            type: 'tag',
            label: '清单打印状态',
            width: 100,
            data: [{type: 'info', key: 1, name: '未打印'}, {type: '', key: 2, name: '打印成功'}],
          },
          {prop: 'kdname', label: '快递公司',},
          {prop: 'express_code', label: '快递单号',width: 140},
          {prop: 'k_dy_time', label: '快递单打印时间', type: "date", sortable: "custom", width: 140},
          {prop: 'qd_dy_time', label: '清单打印时间', type: "date", sortable: "custom", width: 140},
          {prop: 'examine_time', label: '审单时间', type: "date", sortable: "custom", width: 140},
          {prop: 'ship_time', label: '发货时间', type: "date", sortable: "custom", width: 140},
          {prop: 'sign_time', label: '签收时间', type: "date", sortable: "custom", width: 140},
        ],//表格列信息
        dataList: []//表格行信息
      },
      /**必要参数*/
      // 订单签收
      signModal: false,
      SignForm: {},
      // 订单签收
      // 批量操作成功
      successData: {}, // 批量操作成功返回数据
      successModal: false,
      // 批量操作成功
    }
  },
  methods: {

    listClick() {
      console.log(this.tabPaneValue)
      let tabPaneValue = this.tabPaneValue
      let index = tabPaneValue.charAt(9)
      p_footer({id: this.selectRow.id, type: index}).then(res => {
        console.log(res)
        let bottomList = {...this.bottomList}
        bottomList[this.tabPaneValue] = [...res.data]
        this.bottomList = {...bottomList}
      })
    },

    //切换tab现在无用
    changeTab() {
      let tabPaneValue = this.tabPaneValue
      let index = tabPaneValue.charAt(9)
      p_footer({id: this.selectRow.id, type: index}).then(res => {
        let bottomList = {...this.bottomList}
        bottomList[this.tabPaneValue] = [...res.data]
        this.bottomList = {...bottomList}
      })
    },

    successCallback(data) {
      this.successData = data
      this.successModal = true
    },


    //发货单批量签收-->弹框
    batchReceiptOfShippingOrder() {
      if (this.selectionList) {
        if (this.selectionList.length > 0) {
          let id_arr = []
          for (let i = 0; i < this.selectionList.length; i++) {
            id_arr.push(this.selectionList[i].id)
          }
          this.SignForm = {ids: id_arr, remarks: null}
          this.signModal = true
        } else {
          this.$message.error('请在左侧选择一个或者多个进行打印')
        }
      } else {
        this.$message.error('请在左侧选择一个或者多个进行打印')
      }
    },

    //发货单批量签收-->保存
    SignSave(data) {
      let odata = {...data}
      batchSign(odata).then(res => {
        this.successCallback(res.data)
        this.signModal = false
        this.getList()
      }).catch(() => {
      })
    },

    //批量打印
    Printing() {
      if (this.selectionList) {
        if (this.selectionList.length > 0) {
          console.log(this.selectionList)
          let plfahuo_code = []
          for (let i = 0; i < this.selectionList.length; i++) {
            plfahuo_code.push(this.selectionList[i].plfahuo_code)
          }
          getCloudNumber({plfahuo_code: plfahuo_code}).then(res => {
            this.type = 1
            this.socket.send(JSON.stringify(res.data));
          })
        } else {
          this.$message.error('请在左侧选择一个或者多个进行打印')
        }
      } else {
        this.$message.error('请在左侧选择一个或者多个进行打印')
      }
    },

    //打印发货清单
    printList() {
      const data = this.selectionList
      if (data) {
        const mianIds = new Array()
        data.map(item => {
          mianIds.push(item.id)
        })
        printPlhuo({ids: mianIds}).then(res => {
          // this.socket.send(JSON.stringify(res.data));
          this.type = 2
          this.socket.send(JSON.stringify(res.data));
          console.log(res.data)
        })
      } else {
        this.$message.warning('请选择一条列表进行操作')
      }
    },

    //打印
    onSocket() {
      let that = this
      this.cc = this.cc + 1
      console.log(this.cc)
      that.socket = new WebSocket('ws://localhost:13528');
      that.socket.onopen = function () {
        // 监听消息
        that.socket.onmessage = function (event) {
          let printResult = JSON.parse(event.data);
          // layer.load();
          if (printResult.cmd == 'print' && (printResult.msg == '成功' || printResult.status == 'success')) {
            //打印成功--做一些自己的处理
            console.log(printResult, '2')
          } else if (printResult.msg == '无效的打印机' || printResult.status == 'failed') {
            console.log("失败！！！！！！！！");
            //打印失败--做一些自己的处理
          }
          let overData = JSON.parse(event.data);
          if (overData.cmd == 'notifyPrintResult' && overData.taskStatus == 'printed') {
            console.log(overData)
            changePlhuoStatus({data: overData.printStatus, type: that.type}).then(res => {
              that.$message.success(res.msg)
              that.getList()
            })
          }
          console.log('Client received a message', event);
        };
        // 监听Socket的关闭
        that.socket.onclose = function (event) {
          console.log('Client notified socket has closed', event);
        };
      };
    },

    // 同步发货
    syncdevFormSave(data) {
      var that = this
      this.$nextTick(() => {
        that.$refs.syncdevForm.validate(valid => {
          if (valid) {
            code_deliver({
                  id: data.mianId,
                  shizong: data.shizong,
                  fahuo_fieight: data.ps_fee,
                }
            ).then(res => {
              that.$message({
                message: res.msg,
                type: 'success'
              })
              that.syncDev = false
              that.syncDelivery()
              that.GetList()
            }).catch(err => {
              that.$message({
                message: err,
                type: 'error'
              })
            })
          } else {
            this.$message({
              message: '信息填写不完整，请将红色处填写完整后再尝试保存！',
              type: 'warning'
            })
          }
        })
      })
    },
    // 同步发货

    //扫码发货
    deliverGoods() {
      this.$router.push({path: '/DeliveryManage/DeliverGoodsManage/scanCodePage'})
      // this.$prompt('请扫码或者输入快递单号', '扫描快递单号', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      // }).then(({ value }) => {
      //   get_express_view({express_code:value}).then(res=>{
      //     let data=res.data
      //     this.syncdevForm = {
      //       mianId: data.mianId,
      //       bz_xin: data.bz_xin,
      //       shizong: data.shizong,
      //       ps_fee: data.ps_fee,
      //       fh_remarks: data.fh_remarks,
      //       remarks:'',
      //       guzong: data.guzong
      //     }
      //
      //     this.syncDev = true
      //     this.$nextTick(function() {
      //       this.$refs.syncdevForm.clearValidate()
      //       this.$refs.customerInput.$el.querySelector('input').focus();
      //     })
      //   })
      // }).catch(() => {});
    },

    //扫码验货
    toExamineGoods() {
      this.$router.push({path: '/DeliveryManage/DeliverGoodsManage/ExamineGoods'})
    },

    //实重聚焦
    getInputFocus(event) {
      console.log("event", event)
      event.currentTarget.select();
    },
    /**这是按钮方法调用*/
    functionCall(name) {
      if (name.length == 1) {
        this[name[0]]();
      } else {
        this[name[0]](name[1]);
      }
    },
    /**这是按钮方法调用*/
    getList() {
      d_list(this.pagingData).then(res => {
        this.pagingData = {
          ...
              this.pagingData,
          page: res.data.current_page,
          limit: res.data.per_page,
          total: res.data.total,
        }
        let tableDataInfo = {...this.tableDataInfo, dataList: res.data.data}
        this.tableDataInfo = tableDataInfo
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()

      this.onSocket()
    })
  },
  components: {
    ldlTablePagination,
    buttonBox,
    ldlControlWindow
  },
}
</script>

<style scoped>

</style>