//widget.js
//定义widget抽象类
//为Widget类设计添加统一生命周期

define(['jquery'], function($) {

	function Widget() {
		// this.handlers = {}
		this.boundingBox = null;  //#1属性：最外层容器
	}

	Widget.prototype = {
		//自定义事件#2 添加两个方法on 和 fire
		//on 关于事件绑定 方法类似addEvenListener, 可以正在多处监听
		on: function(type, handler) {
			if (typeof this.handlers[type] == "undefined") {
				this.handlers[type] = [];
			}
			this.handlers[type].push(handler);
			return this;
		},
		//fire 关于事件触发 
		fire: function(type, data) {
			if (this.handlers[type] instanceof Array) {
				var handlers = this.handlers[type];
				for (var i=0, len = handlers.length; i<len; i++) {
					handlers[i](data);
				}
			}
		},


		//#5方法：渲染组件
		render: function(container) {
			this.renderUI();
			// 事件管理器
			this.handlers = {};

			// 绑定事件
			this.bindUI();
			this.syncUI();
			$(container || document.body).append(this.boundingBox);
		},

		//#6方法：销毁组件
		destroy: function() {
			this.destructor();
			this.boundingBox.off(); // 解绑事件
			this.boundingBox.remove(); //移除组件
		},

		//#2接口：添加dom节点
		renderUI: function() {},

		//#3接口：监听事件
		bindUI: function() {},

		//#4接口：初始化组件属性
		syncUI: function() {},

		//接口： 销毁前的处理函数
		destructor: function() {},

	}

	return {
		Widget: Widget
	}
});