<template>
  <div>
    <el-dialog title="工作提交" :visible.sync="$root.dialogTableVisible">
      <el-form
        :label-position="right"
        :rules="rules"
        label-width="80px"
        ref="formLabelAlign"
        :model="formLabelAlign"
      >
        <el-form-item label="标题" prop="Title">
          <el-input v-model="formLabelAlign.Title"></el-input>
        </el-form-item>
        <el-form-item label="Client A" prop="ClientA">
          <el-input type="number" v-model="formLabelAlign.ClientA"></el-input>
        </el-form-item>
        <el-form-item label="Client B" prop="ClientB">
          <el-input type="number" v-model="formLabelAlign.ClientB"></el-input>
        </el-form-item>
        <el-form-item label="Client C" prop="ClientC">
          <el-input type="number" v-model="formLabelAlign.ClientC"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$root.dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="Confrim('formLabelAlign')">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { sp, Search, Web } from "@pnp/sp";
let web = new Web("https://rfcomms.sharepoint.cn/sites/RFTHSH-TimeSheet");

export default {
  name: "D-INDEX",
  data() {
    var checkClient = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("值不能为空"));
      }
      setTimeout(() => {
        value = Number(value);
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          let yu = value % 5;
          if (yu !== 0) {
            callback(new Error("必须是5的倍数"));
          } else {
            callback();
          }
        }
      }, 200);
    };
    return {
      formLabelAlign: {
        Title: "",
        ClientA: "",
        ClientB: "",
        ClientC: ""
      },
      //表单验证
      rules: {
        ClientA: [{ validator: checkClient, trigger: "blur" }],
        ClientB: [{ validator: checkClient, trigger: "blur" }],
        ClientC: [{ validator: checkClient, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getUser();
    this.getItems();
  },
  methods: {
    //获取基本信息  名称  部门
    getUser() {
      let me = this;
      web.currentUser.get().then(CurrentUser => {
        console.log(CurrentUser);
        me.formLabelAlign.Title = CurrentUser["Title"];
      });
    },
    getItems() {
      let me = this;

      let res = web.lists
        .getById("736e879c-c50c-4b00-acb2-b10d502a76d9")
        .items.get()
        .then(res => {
          console.log(res);
        });
    },
    Confrim(formName) {
      let me = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          var total =
            Number(me.formLabelAlign.ClientA) +
            Number(me.formLabelAlign.ClientB) +
            Number(me.formLabelAlign.ClientC);

          console.log("total", total);
          if (total < 100) {
            me.$confirm("总量小于100，请确认是否提交?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                let res = web.lists
                  .getById("736e879c-c50c-4b00-acb2-b10d502a76d9")
                  .items.add({
                    Title: me.formLabelAlign.Title,
                    Client_x0020_A: me.formLabelAlign.ClientA / 100,
                    Client_x0020_B: me.formLabelAlign.ClientB / 100,
                    Client_x0020_C: me.formLabelAlign.ClientC / 100
                  })
                  .then(
                    res => {
                      console.log(res);
                      me.dialogTableVisible = false;
                      this.$nextTick(() => {
                        window.location.reload();
                      });
                    },
                    err => {
                      me.$message.error("提交失败");
                    }
                  );
              })
              .catch(() => {
                console.log("取消");
              });
          } else {
            me.$message.error("总量不能大于100，无法提交");
            return false;
          }
        }
      });

      console.log(me.formLabelAlign);
    },
    addItems() {}
  }
};
</script>

<style lang="scss" module>
</style>


