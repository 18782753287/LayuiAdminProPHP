/**

 @Name：layuiAdmin 主页控制台
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：GPL-2
    
 */

layui.define(function(exports){
  

  Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
} 
time1 = new Date().Format("yyyy-MM-dd");
time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");

  /*
    下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
  */

  //用户列表
  layui.use(['table','form'], function(){
    var $ = layui.$
    ,table = layui.table
    ,form = layui.form
    ,admin = layui.admin;
    //登录信息
    table.render({
      elem: '#LAY-ssr-user-list'
      ,url: '/ssr/Suser/getList' //模拟接口
      ,page: true
      ,where: {
        access_token: layui.data('layuiAdmin').access_token
      }
      ,cols: [[
        // {type: 'numbers', fixed: 'left'}
        { field: 'uid', title: 'id', minWidth: 30, sort: true,fixed:'left',width:30}
        ,{field: 'email', title: '邮箱', minWidth: 100, sort: true,width:200}
        ,{field: 'user_name', title: '昵称', minWidth: 100,width:120}
        ,{field: 'enable', title: '账户状态', minWidth: 40,width:100 ,templet: '#switchTpl', unresize: true}
        ,{field: 'plan', title: '套餐', minWidth: 55,width:60 }
        ,{field: 'reservation_indent_finish', title: '有效期', sort: true, minWidth: 120,width:120 ,templet: '#transfer_time', unresize: true ,event: 'TsetSign'}
        ,{field: 'key_url', title: '订阅地址', minWidth: 120,width:220}
        ,{field: 'transfer_enable', title: '可用流量', minWidth: 40,width:100 ,templet: '#transfer_enable', unresize: true}
        ,{field: 'transfer_enable', title: '总量流量', minWidth: 40,width:100 ,event: 'all_enable'}
        ,{field: 't', title: '最后使用时间', minWidth: 160, sort: true,width:160}
        ,{fixed: 'right', width:80, align:'center', toolbar: '#operate'}

       
      ]]
      ,skin: 'line'
      ,id: 'testReload'
    });

  //监听单元格事件
  table.on('tool(topSearchtest)', function(obj){
    var data = obj.data;
    if(obj.event === 'TsetSign'){
      layer.prompt({
        formType: 2
        ,title: '修改邮箱为 ['+ data.email +'] 的有效期'
        ,value: data.reservation_indent_finish
      }, function(value, index){
        layer.close(index);
        //这里一般是发送修改的Ajax请求
        admin.req({
          url: '/ssr/Suser/updataReservation' //实际使用请改成服务端真实接口
          ,data: {
            uid: data.uid,
            data:value,
          }
          ,done: function(res){        
            layer.msg('操作成功', {
              offset: '30px'
              ,icon: 1
              ,time: 3000
            });
          }
        });

        //同步更新表格和缓存对应的值
        obj.update({
          reservation_indent_finish: value
        });
      });
    }

    if(obj.event === 'all_enable'){
      layer.prompt({
        formType: 2
        ,title: '修改邮箱为 ['+ data.email +'] 的总流量'
        ,value: data.transfer_enable
      }, function(value, index){
        layer.close(index);
        //这里一般是发送修改的Ajax请求
        admin.req({
          url: '/ssr/Suser/updataTransferEnable' //实际使用请改成服务端真实接口
          ,data: {
            uid: data.uid,
            data:value,
          }
          ,done: function(res){        
            layer.msg('操作成功', {
              offset: '30px'
              ,icon: 1
              ,time: 3000
            });
          }
        });

        //同步更新表格和缓存对应的值
        obj.update({
          transfer_enable: value
        });
      });
    }



  });

  //监听性别操作
  form.on('switch(enableDemo)', function(obj){
    uid = this.value;
    type = obj.elem.checked;
    admin.req({
      url: '/ssr/Suser/updataEnable' 
      ,data: {
        uid: uid,
        type:type,
      }
      ,done: function(res){        
        layer.msg('操作成功', {
          offset: '30px'
          ,icon: 1
          ,time: 3000
        });
      }
    });

                //id       nmae    状态
    // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);

    //请求修改状态的方法

  });

  //搜索
  $('#seekbut').on('click', function(){

    table.reload('testReload',{
      where: {
        whe: $('#seekid').val(),
        //…
      }
      ,page: {
        curr: 1 //重新从第 1 页开始
      }
    });


  });
});


  exports('console', {})
});