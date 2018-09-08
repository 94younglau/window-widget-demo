// windows.js
//模块定义
//模块层

//////////////////////////
//////////应用层//////////====> main.js
//////////////////////////

//////////////////////////
/////////定制组件/////////====> window.js
//////////////////////////
//////框//架//组//件////// 
//////////////////////////
///////框架通用层/////////====> Widget.js
//////////////////////////

//////////////////////////
////////框架CORE//////////====> jquery.js
//////////////////////////

//////////////////////////
///////浏览器底层/////////=====> 原生API
//////////////////////////


// 重点！！！！！！
// 简单回调存在的问题：
// 1 只能绑定一个回调函数 ( 只有一个位置传参 ,一个参数为回调函数.)
// 2 回调的绑定时间和组件实例化时间耦合在一起.(传入回调函数的时机是一致的,没有灵活性.)
// 关键的问题是 没有将事件抽象分离出来


// 自定义事件：基于原生事件
// 1.原生事件
//// 1.1 DOM事件：click、mousedown、mouseover、focus、blur、load...
//// 1.2 BOM事件：resize、beforeunload、storage、 orientationchange...
// 2.自定义事件
//// 2.1 本质：观察者模式
//// 2.2 优点：跳出原生事件的限制，提高封装的抽象层级


//连缀语法：类似于jquery的链式操作
//实现原理就是在方法的后面 return this


//如何实现Widget抽象类 
//例如alert、prompt和confirm都具有相似的功能，这是可以将它们抽象成一个类
//类根据与UI关系分为两种：无关的utilities(ajax,cookie),有关的Widget(UI组件)
//详见widget.js定义widget抽象类




define(['widget', 'jquery', 'jqueryUI'], function(widget, $, $UI){

	function Window(){

		//封装配置
		this.cfg = {
			width: 500, //自定义弹窗宽高
			height: 300,
			title: "系统消息", //#1可定制的标题 默认标题 
			content: "",  //调整接口把 content和handler并入cfg字典中
			hasCloseBtn: false, //#2可定制的关闭按钮， 默认没有
			handler4AlertBtn: null, //#3绑定按钮事件监听
			handler4CloseBtn: null, //#3绑定按钮事件监听
			skinClassName: null, //#4定制皮肤
			text4AlertBtn: "确定", //#5定制按钮文案
			hasMask: true, //#6定制模态弹窗
			isDraggable: true, //#7使用jqueryUI实现拖动, 再次之前要添加jqueryUI模块
			dragHandle: null, // #7设置拖动的把手

			//confirm方法
			text4ConfirmBtn: "确定",
			text4CancelBtn: "取消",
			handler4ConfirmBtn: null,
			handler4CancelBtn: null,

			//prompt方法
			text4PromptBtn: "确定",
			isPromptInputPassword: false,
			defaultValue4PromptInput: "",
			maxlength4PromptInput: 10,
			handler4PromptBtn: null,

			//common方法

		};
	}



	Window.prototype = $.extend({}, new widget.Widget(), {

		//调整接口 content, handler,此时在应用层调用时只需传一个cfg对象
		// var CFG = $.extend(this.cfg, cfg); //***重要混合成一个新的字典CFG			
		
		renderUI: function() {
				//弹窗主体

				var footerContent = "";
				switch(this.cfg.winType) {
					case "alert":
					footerContent = '<input type="button" value ="'
						+ this.cfg.text4AlertBtn
						+ '" class="window_alertBtn">';
					break;
					case "confirm":
					footerContent = '<input type="button" value ="'
						+ this.cfg.text4ConfirmBtn
						+ '" class="window_confirmBtn"><input type="button" value ="'
						+ this.cfg.text4CancelBtn
						+ '" class="window_cancelBtn">';
					break;
					case "prompt":
					this.cfg.content += '<p class="window_promptInputWrapper"><input type="'
						+ (this.cfg.isPromptInputPassword ? "password" : "text")
						+ '"value="'
						+this.cfg.defaultValue4PromptInput
						+ '"maxlength="'
						+ this.cfg.maxlength4PromptInput
						+ '" class="window_promptInput"></p>';
					footerContent = '<input type="button" value="'
						+ this.cfg.text4PromptBtn
						+ '" class = "window_promptBtn"><input type="button" value="'
						+ this.cfg.text4CancelBtn
						+ '" class = "window_cancelBtn">';
					break;
				}
				
				this.boundingBox = $(
					'<div class="window_boundingBox">'+
					'<div class="window_body">'+ this.cfg.content + '</div>'+
					'</div>'
				);

				//添加common方法
				if (this.cfg.winType != "common") {
					this.boundingBox.prepend('<div class="window_header">'+ this.cfg.title + '</div>');
					this.boundingBox.append('<div class="window_footer">' + footerContent + '</div>');
				}

				this.boundingBox.appendTo(document.body);
				this._promptInput = this.boundingBox.find(".window_promptInput");

				//modal
				if(this.cfg.hasMask) {
					this._mask = $('<div class="window_mask"></div>');
					this._mask.appendTo("body");
				}

				//关闭按钮
				if(this.cfg.hasCloseBtn) {
					this.boundingBox.append('<span class="window_closeBtn">X</span>');
				}
			},

			bindUI: function() {
				var that = this;

				this.boundingBox.delegate(".window_alertBtn", "click", function() {
					that.fire("alert");
					that.destroy();
				}).delegate(".window_closeBtn", "click", function() {
					that.fire("close");
					that.destroy();
				}).delegate(".window_confirmBtn", "click", function() {
					that.fire("confirm");
					that.destroy();
				}).delegate(".window_cancelBtn", "click", function() {
					that.fire("cancel");
					that.destroy();
				}).delegate(".window_promptBtn", "click", function() {
					that.fire("prompt", that._promptInput.val());
					that.destroy();
				});

				//自定义事件
				if(this.cfg.handler4AlertBtn) {
					this.on("alert", this.cfg.handler4AlertBtn);
				}
				if(this.cfg.handler4CloseBtn) {
					this.on("close", this.cfg.handler4CloseBtn);
				}
				if(this.cfg.handler4ConfirmBtn) {
					this.on("confirm", this.cfg.handler4ConfirmBtn);
				}
				if(this.cfg.handler4CancelBtn) {
					this.on("cancel", this.cfg.handler4CancelBtn);
				}
				if(this.cfg.handler4PromptBtn) {
					this.on("prompt", this.cfg.handler4PromptBtn);
				}
			},

			syncUI: function() {
				this.boundingBox.css({
					//自定义宽高
					width: this.cfg.width + "px",
					height: this.cfg.height + "px",
					
					//自定义定位
					left: (this.cfg.x || (window.innerWidth - this.cfg.width) / 2) + "px",
					top: (this.cfg.y || (window.innerHeight - this.cfg.height) / 2) + "px"
				});

				//定制皮肤
				if(this.cfg.skinClassName) {
					this.boundingBox.addClass(this.cfg.skinClassName);
				}

				//jqueryUI拖动
				if(this.cfg.isDraggable) {
					if(this.cfg.dragHandle) {//设置可以使用拖动把手的值
						this.boundingBox.draggable({handle: this.cfg.dragHandle});
					} else {
						this.boundingBox.draggable();
					}	
				}
			},

			destructor: function() {
				this._mask && this._mask.remove();
			},

			alert: function(cfg){ 
				$.extend(this.cfg, cfg, {winType: "alert"});//jquery的extend实现字典合并
				this.render();

				//连缀语法
				return this;
			},

			confirm: function(cfg){
				$.extend(this.cfg, cfg, {winType: "confirm"});
				this.render();

				return this;
			},

			prompt: function(cfg){
				$.extend(this.cfg, cfg, {winType: "prompt"});
				this.render();
				this._promptInput.focus();

				return this;
			},

			common: function(cfg) {
				$.extend(this.cfg, cfg, {winType: "common"});
				this.render();

				return this;
			}

		}
	);

	return {
		Window: Window
	}
});