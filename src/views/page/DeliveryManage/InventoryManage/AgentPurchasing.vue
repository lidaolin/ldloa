<template>
  <div class="pageWrap">
    <button-box :buttonBoxState.sync="buttonBoxState" @Callback="functionCall"></button-box>
    <ldl-table-pagination :selectRow.sync="selectRow"
                          :style="{height:'calc(100% - '+ bottomHeight + (buttonBoxState?' - 35px':' - 15px')+')'}"
                          @getList="getList" :tableDataInfo="tableDataInfo"
                          :pagingData.sync="pagingData"></ldl-table-pagination>
    <el-dialog
        v-el-drag-dialog
        top="5%"
        width="50%"
        custom-class="minWidth600"
        :visible.sync="addAttributeState"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        :title="form.id? '修改':'新增'"
        size="mini"
        center
    >
      <el-form ref="form" :model="form" size="mini" :inline="true">
        <el-form-item label="进货单位:" prop="company_id" :rules="{ required: true, message: '进货单位不能为空', trigger: 'blur'}">
          <el-select
              style="width:245px;"
              v-model="form.company_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod"
              :loading="loading">
            <el-option
                v-for="item in company_id_arr"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货单位:" prop="b_company_id"
                      :rules="{ required: true, message: '发货单位不能为空', trigger: 'blur'}">
          <el-select
              style="width: 245px;"
              v-model="form.b_company_id"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="brandMethod_fh"
              :loading="loading">
            <el-option
                v-for="item in b_company_id_arr"
                :key="item.id"
                :label="item.companyName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运费承担方:" prop="freight_type"
                      :rules="{ required: true, message: '运费承担方不能为空', trigger: 'blur'}">
          <el-switch
              v-model="form.freight_type"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="2"
              active-text="进货方承担运费"
              inactive-text="发货方承担运费">
          </el-switch>
        </el-form-item>
        <el-form-item label="进货日期:" prop="p_data" :rules="{ required: true, message: '进货日期不能为空', trigger: 'blur'}">
          <el-date-picker
              v-model="form.p_data"
              type="date"
              value-format="timestamp"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品信息:">
          <el-button size="mini" @click="changeGoods" type="primary">添加商品信息</el-button>
          <el-dialog
              top="5%"
              width="60%"
              title="商品"
              v-el-drag-dialog
              :destroy-on-close="false"
              :close-on-click-modal="false"
              append-to-body
              :visible.sync="changeGoodsState">
            <el-select
                style="width: 240px;!important;"
                size="mini"
                v-model="goods"
                @change="changeSelectGoods"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="productMethod"
                :loading="loading">
              <el-option
                  v-for="item in productArray"
                  :key="item.id"
                  :label="item.product_name"
                  :value="item.id">
              </el-option>
            </el-select>
            <br><br>
            <el-table
                :data="goodsList"
                border
                size="mini"
                height="500px">
              <el-table-column
                  prop="product_attr_val_pash"
                  label="商品规格">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.product_attr_val_pash"
                        :key="index">{{ item.attr_name }}:{{ item.val_name }}</span>
                </template>
              </el-table-column>
              <el-table-column
                  width="250"
                  prop="number"
                  align="center">
                <template slot="header" slot-scope="scope">
                  统一修改数目
                  <el-input-number v-if="scope" v-model="changeAllNumber" :precision="0" size="mini" :min="0"
                                   :step="1"></el-input-number>
                </template>
                <template slot-scope="{row}">
                  <el-input-number v-model="row.number" size="mini" :min="0" :step="1"></el-input-number>
                </template>
              </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="changeGoodsState = false">取 消</el-button>
              <el-button type="primary" @click="addGoodsSubmit">确 定</el-button>
            </div>
          </el-dialog>
        </el-form-item>
        <el-table
            :data="form.product"
            border
            size="mini"
            height="500px">
          <el-table-column
              prop="product_attr_val_pash"
              label="商品规格">
            <template slot-scope="scope">
              {{ scope.row.product_name }}----
              <span v-for="(item,index) in scope.row.product_attr_val_pash"
                    :key="index">{{ item.attr_name }}:{{ item.val_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="price"
              align="center"
              label="数目"
              width="160">
            <template slot-scope="{row}">
              <el-input-number v-model="row.number" size="mini" :min="1" :step="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column
              prop="price"
              align="center"
              label="操作"
              width="160">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delProductRow(scope.$index)"></el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSubmit">{{ form.id ? '立即保存' : '立即创建' }}</el-button>
        <el-button @click="addAttributeState=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
        width="30%"
        custom-class="minWidth400"
        title="发货"
        :destroy-on-close="false"
        :close-on-click-modal="false"
        size="mini"
        center
        :visible.sync="dialogFormVisible">
      <el-form ref="deliverForm" :model="deliverForm" size="mini" :inline="true" label-width="100px">
        <el-form-item label="快递单号:" style="width: 100%">
          <el-input style="width: 240px;" v-model="deliverForm.express_code" placeholder="请输入快递单号"></el-input>
        </el-form-item>
        <el-form-item label="快递公司:">
          <el-input style="width: 240px;" v-model="deliverForm.express_name" placeholder="请输入快递公司"></el-input>
        </el-form-item>
        <el-form-item label="运费" prop="freight" :rules="{ required: true, message: '运费不能为空', trigger: 'blur'}">
          <el-input-number
              style="width: 240px;"
              v-model="deliverForm.freight"
              controls-position="right"
              placeholder="请输入运费"
              :precision="2"
              :step="0.1"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="箱数" prop="case_number" :rules="{ required: true, message: '箱数不能为空', trigger: 'blur'}">
          <el-input-number
              style="width: 240px;"
              v-model="deliverForm.case_number"
              controls-position="right"
              placeholder="请输入箱数"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量" prop="weight" :rules="{ required: true, message: '箱数不能为空', trigger: 'blur'}">
          <el-input-number
              style="width: 240px;"
              v-model="deliverForm.weight"
              controls-position="right"
              placeholder="请输入重量"
              :precision="2"
              :step="0.1"
              :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input style="width: 240px;" v-model="deliverForm.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="determineDeliver">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import ldlTablePagination from "@/components/ldlTablePagination";
import buttonBox from "@/components/buttonBox";
import {
  add,
  edit,
  purchasingAgentList,
  del,
  searchPurchaseList,
  searchDeliverList,
  purchaseSubmit,
  purchaseConfirm,
  purchaseSign,
  purchaseBack,
  purchaseDeliver,
  editDetailed
} from "@/api/DeliveryManage/InventoryManage/AgentPurchasing";
import {getSku, simpleList} from "@/api/PurchaseManage/GoodsInfo/GoodsManage";

export default {
  name: "AgentPurchasing",
  components: {
    ldlTablePagination,
    buttonBox,
  },
  data() {
    return {
      editData: {},
      deliverForm: {},
      dialogFormVisible: false,
      changeAllNumber: 1,
      addAttributeState: false,
      form: {},
      loading: false,//控制搜索加载的
      company_id_arr: [],//进货单位数组
      b_company_id_arr: [],//发货单位数组
      productArray: [],
      goods: '',
      goodsList: [],//商品信息数组
      changeGoodsState: false,//商品信息弹框
      /**必要参数*/
      selectRow: undefined, //选中行
      pagingData: undefined,//getList的传参
      bottomHeight: '0%',//底部高度
      buttonBoxState: true,//开启按钮行的状态
      tableDataInfo: { //表格信息
        dataListInfo: [
          {prop: 'purchase_code', label: '进货单号',},
          {
            prop: 'purchase_status',
            type: 'tag',
            label: '状态',
            data: [{type: 'info', key: 1, name: '已录入'}, {type: 'primary', key: 2, name: '已提交'}, {
              type: 'warning',
              key: 3,
              name: '已确认'
            }, {type: 'danger', key: 4, name: '已发货'}, {type: 'success', key: 5, name: '已签收'},],
          },
          {prop: 'goods_fee', label: '进货锁定价', sortable: "custom"},
          {prop: 'freight', label: '发货运费', sortable: "custom"},
          {
            prop: 'freight_type',
            type: 'tag',
            label: '运费承担方',
            data: [{type: 'primary', key: 1, name: '进货方承担运费'}, {type: 'primary', key: 2, name: '发货方承担运费'}],
            width: 130,
          },
          {prop: 'express_name', label: '发货公司'},
          {prop: 'case_number', label: '快递单号'},
          {prop: 'case_number', label: '总箱数', sortable: "custom"},
          {prop: 'weight', label: '重量', sortable: "custom"},
          {prop: 'create_time', label: '录入时间', type: "date", sortable: "custom", width: 140,},
          {prop: 'submit_time', label: '提交时间', type: "date", sortable: "custom", width: 140,},
          {prop: 'affirm_time', label: '确认时间', type: "date", sortable: "custom", width: 140,},
          {prop: 'p_data', label: '进货时间', type: "date", sortable: "custom", width: 140,},
          {prop: 'send_time', label: '发货时间', type: "date", sortable: "custom", width: 140,},
          {prop: 'sign_time', label: '签收时间', type: "date", sortable: "custom", width: 140,},
        ],//表格列信息
        dataList: []//表格行信息
      },
      /**必要参数*/
    }
  },
  watch: {
    changeAllNumber() {
      for (let i = 0; i < this.goodsList.length; i++) {
        let goodsList = [...this.goodsList]
        goodsList[i].number = this.changeAllNumber
        goodsList[i].product_sku_id = goodsList[i].id
        this.goodsList = [...goodsList]
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    delProductRow(index){
      let product=[... this.form.product]
      product.splice(index,1)
      let form ={... this.form}
      form.product=product
      this.form = {... form}
      console.log(index)
    },
    //提交
    submitPurchase() {
      if (this.selectRow) {
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({value}) => {
          let data = {
            id: this.selectRow.id,
            remarks: value
          }
          purchaseSubmit(data).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            this.getList()
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$message.error('请选中一行')
      }
    },

    //确认
    confirmPurchase() {
      if (this.selectRow) {
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({value}) => {
          let data = {
            id: this.selectRow.id,
            remarks: value
          }
          purchaseConfirm(data).then(() => {
            this.$message({
              type: 'success',
              message: '确认成功'
            });
            this.getList()
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$message.error('请选中一行')
      }
    },

    //发货
    deliverPurchase() {
      if (this.selectRow) {
        this.deliverForm = {}
        this.$nextTick(function () {
          this.$refs.deliverForm.clearValidate();
        });
        this.dialogFormVisible = true
      } else {
        this.$message.error('请选中一行')
      }
    },


    //发货->确认发货
    determineDeliver() {
      this.$refs.deliverForm.validate((valid) => {
        if (valid) {
          let data = {...this.deliverForm, id: this.selectRow.id}
          purchaseDeliver(data).then(() => {
            this.dialogFormVisible = false
            this.$message({
              type: 'success',
              message: '发货成功'
            });
            this.getList()
          })
        }
      })
    },

    //签收
    signPurchase() {
      if (this.selectRow) {
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({value}) => {
          let data = {
            id: this.selectRow.id,
            remarks: value
          }
          purchaseSign(data).then(() => {
            this.$message({
              type: 'success',
              message: '签收成功'
            });
            this.getList()
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$message.error('请选中一行')
      }
    },

    //返回
    backPurchase() {
      if (this.selectRow) {
        this.$prompt('请输入备注信息', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea'
        }).then(({value}) => {
          let data = {
            id: this.selectRow.id,
            remarks: value
          }
          purchaseBack(data).then(() => {
            this.$message({
              type: 'success',
              message: '返回成功'
            });
            this.getList()
          }).catch(() => {
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      } else {
        this.$message.error('请选中一行')
      }
    },

    // 添加/修改商品打开弹窗
    changeGoods() {
      this.goods = ''
      this.productMethod()
      this.goodsList = []
      this.changeGoodsState = true
      // }
    },

    //商品搜索接口
    productMethod(e) {
      this.loading = true
      simpleList({product_name: e}).then(res => {
        this.productArray = res.data
        this.loading = false
      })
    },

    changeSelectGoods() {
      getSku({product_id: this.goods}).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].number = 0
        }
        this.goodsList = res.data
      })
    },

    //添加商品信息的按钮函数
    addGoodsSubmit() {
      let form = {...this.form}
      let allId = []
      let delId = []
      for (let i = 0; i < form.product.length; i++) {
        for (let j = 0; j < this.goodsList.length; j++) {
          if (form.product[i].id === this.goodsList[j].id) {
            allId.push({index: i, indexTwo: j})
          }
        }
      }
      let goodsListTwo = [...this.goodsList]
      for (let i = allId.length - 1; i >= 0; i--) {
        form.product[allId[i].index].number += this.goodsList[allId[i].indexTwo].number
        goodsListTwo.splice(allId[i].indexTwo, 1)
      }
      for (let i = 0; i < goodsListTwo.length; i++) {
        if (goodsListTwo[i].number === 0) {
          delId.push(i)
        }
      }
      let goodsListTree = goodsListTwo
      for (let i = delId.length - 1; i >= 0; i--) {
        goodsListTree.splice(delId[i], 1)
      }
      form.product = form.product.concat(goodsListTree)
      this.form = {...form}
      console.log(this.form, '**************------------*********')
      this.changeGoodsState = false
    },

    // 进货单位搜索
    brandMethod(e) {
      this.loading = true
      searchPurchaseList({key: e}).then(res => {
        this.company_id_arr = res.data
        this.loading = false
      })
    },

    // 发货单位搜索
    brandMethod_fh(e) {
      this.loading = true
      searchDeliverList({key: e}).then(res => {
        this.b_company_id_arr = res.data
        this.loading = false
      })
    },

    // 删除
    delAttribute() {
      if (this.selectRow) {
        this.$confirm('此操作将永久删除--该进货单--, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({id: this.selectRow.id}).then(() => {
            this.getList()
            this.$message.success('删除成功')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        this.$message.error('请选中一行')
      }
    },

    //新增还是修改
    changeAttribute(e) {
      if (e === 'edit') {
        if (this.selectRow) {
          editDetailed(this.selectRow.id).then(res => {
            this.editData = res.data
            this.form = {
              ...this.editData,
              p_data:this.editData.p_data*1000,
              id: this.selectRow.id,
            }
            this.addAttributeState = true
          })
        } else {
          this.$message.error('请选中一行')
        }
      } else {
        this.form = {
          freight_type: 1,
          product: [],
        }
        this.$nextTick(function () {
          this.$refs.form.clearValidate();
        });
        this.addAttributeState = true
      }
      this.brandMethod()
      this.brandMethod_fh()
    },

    //新增修改的保存
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            let data = {
              ...this.form,
              p_data:this.form.p_data/1000
            }
            edit(data).then(() => {
              this.addAttributeState = false
              this.$message.success('修改成功')
              this.getList()
            })
          } else {
            // let data = { ...this.form,product:JSON.stringify(this.form.product)}
            add(this.form).then(() => {
              this.addAttributeState = false
              this.$message.success('添加成功')
              this.getList()
            })

          }
        }
      })
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
      purchasingAgentList(this.pagingData).then(res => {
        this.pagingData = {
          ...this.pagingData,
          page: res.data.current_page,
          limit: res.data.per_page,
          total: res.data.total,
        }
        let tableDataInfo = {...this.tableDataInfo, dataList: res.data.data}
        this.tableDataInfo = tableDataInfo
      })
    }
  },

}
</script>

<style scoped>

</style>