// main.js
//应用层
//映射模块名和路径
require.config({
	paths: {
		jquery: 'jquery-3.1.1.min',
		//添加jqueryUI组件，用于拖动功能
		jqueryUI: 'http://code.jquery.com/ui/1.10.4/jquery-ui'
	}
});

require(['jquery', 'window'], function($, w){
	
	$("#a").click(function(){ //这就是handler函数
		new w.Window().alert({
			title: "提示",
			content: "welcome!",
			handler4AlertBtn: function() {
				alert("you click the alert button");
			},
			handler4CloseBtn: function() {
				alert("you click the close button");
			},
			width: 300,
			height: 150,
			y: 50,
			hasCloseBtn: true,
			// skinClassName: "window_skin_a"
			text4AlertBtn: "OK",
			dragHandle: ".window_header"
		})
			.on("alert", function() {	alert("使用连缀语法了！"); })
			.on("close", function() { alert("又使用连缀语法了！"); });

	});

	$("#b").click(function() {
		// var win = new w.Window();
		new w.Window().confirm({
			title: "系统消息",
			content: "你确定要删除这个文件吗？",
			width: 300,
			height: 150,
			y: 50,
			hasCloseBtn: true,
			text4ConfirmBtn: "是",
			text4CancelBtn: "否",
			dragHandle: ".window_header"
		})
			.on("confirm", function() {alert("确定");})
			.on("cancel", function() {alert("取消");});
	});

	$("#c").click(function() {
		new w.Window().prompt({
			title: "请输入你的名字",
			content: "我们会为你呢保密输入的信息。",
			width: 300,
			height: 150,
			y: 50,
			hasCloseBtn: true,
			text4PromptBtn: "输入",
			text4CancelBtn: "取消",
			defaultValue4PromptInput: "张三",
			dragHandle: ".window_header",
			handler4PromptBtn: function(inputValue) {
				alert("你输入的内容是：" + inputValue);
			},
			handler4CancelBtn: function() {
				alert("取消");
			}
		});
	});

	$("#d").click(function() {
		new w.Window().common({
			content: "我是一个弹窗",
			width: 300,
			height:50,
			y: 50,
			hasCloseBtn: true
		});
	});
	
});