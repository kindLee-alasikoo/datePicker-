function Calendar() {
	var wrapContent = this;
	var boxWrap = $('<div class="calendar_box_wrap hide"></div>'); //外层透明遮罩
	var wrapNode = this.wrapNode = $('<div class="calendar_box"></div>'); //日历外壳
	boxWrap.append(wrapNode.get(0));
	var nstr = new Date(); //当前Date资讯
	var ynow = nstr.getFullYear(); //年份
	var mnow = nstr.getMonth(); //月份
	var mnowTxt = mnow + 1;
	var dnow = nstr.getDate(); //今日日期
	var hnow = nstr.getHours(); //当前小时
	var minnow = nstr.getMinutes(); //当前分钟
	var nowData = new Date(); //选中日期
	var week = "周" + "日一二三四五六".split("")[nowData.getDay()];
	var dataList = {};
	var selectHour = 0;
	var selectMinutes = 0;
	dataList.year = ynow;
	dataList.info = mnowTxt + "月" + dnow + "日" + "," + week;
	dataList.txt = ynow + "年" + mnowTxt + "月";
	var headShowNode = new HeadShowNode();
	var calendarNode = new CalendarNode();
	var buttonNode = new ButtonNode();
	var timeNode = new TimeNode();
	var monthNode = new MonthNode();
	var yearNode = new YearNode();
	var cfg = {};
	var finalDate = null;
	var formatParameter = ""; //格式化格式
	var clickMark = 0; //0-未点击，1-点击过一次，2-点击过两次
	//参数数组
	var arg = Array.prototype.slice.call(arguments);

	//var 默认配置
	var defaultConfig = {
		showPosition: "false",
		wrapBg: "rgba(0, 0, 0, 0.541176)",
		inputId: "",
		boxWidth: "240px",
		boxHeight: "350px",
		boxRadius: "0px",
		txtColor: "#222222",
		bgColor: "#ffffff",
		boxPadding: "0",
		boxMargin: "-175px 0 0 -120px",
		boxZIndex: "999",
		boxOpacity: "1",
		boxSizing: "border-box",
		boxPosition: "absolute",
		boxTop: "50%",
		boxLeft: "50%",
		boxShadow: "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
		headColor: "#f36444",
		startTime: "1970-0-1 00:00",
		endTime: "2100-0-1 00:00",
		dataFormat: "yyyy-MM-dd hh:mm",
		isHourMin: true,
		isHourOnly: false,
		callback: null,
		showCallback: null,
		hideCallback: null
	};
	//配置函数(会根据用户传的参数和defaultConfig合并生成用户配置对象)
	var config = $.extend({},defaultConfig, arg[0]);
	
	var startTimeArr=config.startTime.split(" ");
	var endTimeArr=config.endTime.split(" ");
	
	var startYear=startTimeArr[0].split("-")[0];
	var startMonth=startTimeArr[0].split("-")[1]-1;
	var startDay=startTimeArr[0].split("-")[2];
//	var startHour=startTimeArr[1].split(":")[0];
//	var startMin=startTimeArr[1].split(":")[1];

	var endYear=endTimeArr[0].split("-")[0];
	var endMonth=endTimeArr[0].split("-")[1]-1;
	var endDay=endTimeArr[0].split("-")[2];
//	var endHour=endTimeArr[1].split(":")[0];
//	var endMin=endTimeArr[1].split(":")[1];
	
	if(config.showPosition == true) {
		config.boxTop = parseInt($(config.inputId).offset().top) + parseInt($(config.inputId).css("height")) + "px";
		config.boxLeft = $(config.inputId).offset().left;
		config.boxMargin = 0;
		config.wrapBg = "rgba(255, 255, 255,0)";
	} else {
		config.boxTop = "50%";
		config.boxLeft = "50%";
		config.boxMargin = "-175px 0 0 -120px";
		config.wrapBg = "rgba(0, 0, 0, 0.541176)";
	}

	//添加到页面
	this.appendTo = function(_jq) {
		$(_jq).append(boxWrap.get(0));
		boxWrap.css({
			background: config.wrapBg
		})
		wrapNode.css({
			width: config.boxWidth,
			height: config.boxHeight,
			borderRadius: config.boxRadius,
			color: config.txtColor,
			background: config.bgColor,
			fontSize: config.txtSize,
			padding: config.boxPadding,
			margin: config.boxMargin,
			zIndex: config.boxZIndex,
			opacity: config.boxOpacity,
			boxSizing: config.boxSizing,
			position: config.boxPosition,
			top: config.boxTop,
			left: config.boxLeft,
			boxShadow: config.boxShadow
		});
	};
	//初始化
	this.setConfig = function() {
			wrapContent.appendTo("body");
			wrapContent.setInstall();
			wrapContent.formatDate();
		}
	//初始化设置
	this.setInstall = function() {
		wrapContent.wrapNode.find(".go_back_btn").addClass("hide");
		wrapContent.wrapNode.find(".cancel_btn").removeClass("hide");
		calendarNode.show();
		timeNode.hide();
		formatMark = config.isHourMin;
		if(formatMark) {
			wrapContent.wrapNode.find(".make_sure_btn").removeClass("hide");
			wrapContent.wrapNode.find(".ok_btn").addClass("hide");
		} else {
			wrapContent.wrapNode.find(".make_sure_btn").addClass("hide");
			wrapContent.wrapNode.find(".ok_btn").removeClass("hide");
		}
	}
	var calendarControl = new CalendarControl();
	//回调函数
	this.setCallback = function(_callback) {
		callback = _callback;
	};
	this.getCallback = function() {
		return callback;
	};
	this.show = function() {
		boxWrap.fadeIn(500, function() {
			if(typeof(config.showCallback) === "function") {
				config.showCallback();
			}
		}).removeClass("hide");
	}
	this.hide = function() {
		boxWrap.fadeOut(500, function() {
			if(typeof(config.hideCallback) === "function") {
				config.hideCallback();
			}
		}).addClass("hide");
	}
	//格式化日期
	this.formatDate = function() {
		formatParameter = config.dataFormat;
		var paddNum = function(num) {
			num += "";
			return num.replace(/^(\d)$/, "0$1");
		}
		//指定格式字符
		cfg = {
			yyyy: ynow, //年 : 4位				
			yy: ynow.toString().substring(2), //年 : 2位				
			M: mnowTxt, //月 : 如果1位的时候不补0				
			MM: mnowTxt < 10 ? "0" + mnowTxt : mnowTxt, //月 : 如果1位的时候补0				
			d: dnow, //日 : 如果1位的时候不补0				
			dd: dnow < 10 ? "0" + dnow : dnow, //日 : 如果1位的时候补0				
			hh: selectHour < 10 ? "0" + selectHour : selectHour, //时				
			mm: selectMinutes < 10 ? "0" + selectMinutes : selectMinutes, //分				
			ss: "00" //秒
		}
		if(!formatMark) {
			if(formatParameter.indexOf("h") == -1) {
				formatParameter = formatParameter;
			} else {
				formatParameter = "yyyy-MM-dd";
			}
		}
		return formatParameter.replace(/([a-z])(\1)*/ig, function(m) {
			return cfg[m];
		});
	}
	this.getNowTime = function() {
			var aaaaaa = new Date(ynow, mnow, dnow, selectHour, selectMinutes).getTime();
			return aaaaaa;
		}
		//总管理器
	function CalendarControl() {
		headShowNode.setData(dataList);
		calendarNode.setData();
		buttonNode.setData();
		timeNode.setData();
		monthNode.setData();
		yearNode.setData();
	}

	//头部显示对象
	function HeadShowNode() {
		var content = this;
		var node = this.node = $('<div class="head_show"><div class="head_year">' + "2016" + '</div><div class="head_info_box"><div class="head_info">' + "12月30日,周五" + '</div></div></div>');

		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		}
		this.setData = function(_dataList) {
			node.css({
				background: config.headColor
			});
			content.appendTo(wrapNode);
			content.setText(_dataList);
		}
		this.setText = function(_list) {
			node.find(".head_year").text(_list.year);
			node.find(".head_info").text(_list.info);
		}
	}
	//中部日历对象
	function CalendarNode() {
		var content = this;
		var node = this.node = $('<div class="calendar_node_wrap"></div>');

		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		}
		this.setData = function() {
			content.appendTo(wrapNode);
			content.setCalendar(ynow, mnow, dnow);
		}
		this.show = function() {
			content.node.css({
				left: "0px"
			});
		}	
		this.hide = function() {
			content.node.css({
				left: "-300px"
			});
		}
			//缩小消失
		this.hideScale = function() {
				content.node.find(".all_wrap").removeClass("scale_box_big").removeClass("scale_box_big_big").addClass("scale_box_lit").addClass("hide");
			}
			//放大出现
		this.showScale = function() {
				content.node.find(".num_wrap").removeClass("num_wrap_move");
				content.node.find(".all_wrap").removeClass("scale_box_big_big").removeClass("scale_box_lit").addClass("scale_box_big").removeClass("hide");
			}
			//判断选中月份是否为当年当月
		this.selectIsYM = function() {
			if(ynow == new Date().getFullYear() && mnow == new Date().getMonth()) {
				content.setCalendar(ynow, mnow, new Date().getDate());
			} else {
				content.setCalendar(ynow, mnow, 0);
			}
		}
		this.setCalendar = function(_year, _mnow, _dnow) {
			node.empty();
			mnowTxt = _mnow + 1;
			dataList.txt = _year + "年" + mnowTxt + "月";
			var btnNode = $('<div class="calendar_node"><div class="prev_month">' + "<" + '</div><div class="calendar_txt"><div class="calendar_txt_move">' + dataList.txt + '</div></div><div class="next_month">' + ">" + '</div><div class="clear_float"></div></div>');
			node.append(btnNode.get(0));

			function isLeap(_year) {
				return(_year % 100 == 0 ? res = (_year % 400 == 0 ? 1 : 0) : res = (_year % 4 == 0 ? 1 : 0));
			} //是否为闰年
			var n1str = new Date(_year, _mnow, 1); //当月第一天Date资讯
			var firstday = n1str.getDay(); //当月第一天星期几
			var m_days = new Array(31, 28 + isLeap(_year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); //各月份的总天数
			var tr_str = Math.ceil((m_days[_mnow] + firstday) / 7); //表格所需要行数
			var calendarWrap, calendarOne, calendarTwo, calendarThree, calendarFour, calendarKong, calendarBox;
			calendarOne = $("<div class='tr_box'><div class='calendar_week'>日</div><div class='calendar_week'>一</div><div class='calendar_week'>二</div><div class='calendar_week'>三</div><div class='calendar_week'>四</div><div class='calendar_week'>五</div><div class='calendar_week'>六</div></div>");
			calendarBox = $("<div class='all_wrap'></div>");
			calendarWrap = $("<div class='num_wrap num_wrap_move'></div>");
			node.append(calendarBox.get(0));
			calendarBox.append(calendarOne.get(0));
			calendarBox.append(calendarWrap.get(0));
			for(i = 0; i < tr_str; i++) { //表格的行
				for(k = 0; k < 7; k++) { //表格每行的单元格
					idx = i * 7 + k; //单元格自然序列号
					date_str = idx - firstday + 1; //计算日期
					(date_str <= 0 || date_str > m_days[_mnow]) ? date_str = "&nbsp;": date_str = idx - firstday + 1; //过滤无效日期（小于等于零的、大于月总天数的）
					//打印日期：今天底色为红
					if(date_str == _dnow) {
						calendarTwo = $("<div class='calendar_fl calenda_today'><div class='color_bg calender_select_node'></div><div class='calender_txt'>" + date_str + "</div></div>");
						calendarWrap.append(calendarTwo.get(0));
					} else if(date_str == "&nbsp;") {
						calendarKong = $("<div class='kong'>" + date_str + "</div>");
						calendarWrap.append(calendarKong.get(0));
					} else {
						calendarThree = $("<div class='calendar_fl'><div class='color_bg'></div><div class='calender_txt'>" + date_str + "</div></div>");
						calendarWrap.append(calendarThree.get(0));
					}
				}
			}
			calendarFour = $("</div>");
			node.append(calendarFour.get(0));
			node.find(".calenda_today").css({
				background: config.headColor
			});			
			
			//点击上个月
			node.find(".prev_month").bind("click", function() {
				monthNode.hide();
				yearNode.hide();
				if(mnow == 0) {
					ynow--;
					mnow = 12;
				}
				mnow--;
				content.selectIsYM();
				clickMark = 0;
				buttonNode.show();
			})
			//点击下个月
			node.find(".next_month").bind("click", function() {
				monthNode.hide();
				yearNode.hide();
				if(mnow == 11) {
					ynow++;
					mnow = -1;
				}
				mnow++;
				content.selectIsYM();
				clickMark = 0;
				buttonNode.show();
			})
			//点击中部年份
			node.find(".calendar_txt").bind("click", function() {
				clickMark++;
				if(clickMark == 1) { //第一次
					wrapNode.find(".calendar_txt_move").text(ynow + "年");
					calendarNode.hideScale();
					monthNode.show();
					buttonNode.hide();
				} else if(clickMark == 2) { //第二次
					wrapNode.find(".calendar_txt_move").text(ynow + "年");
					buttonNode.hide();
					monthNode.hide();
					yearNode.show();
				} else {
					return false;
				}
			})

			//点击日期
			node.find(".calendar_fl").bind("click", function() {
				node.find(".calendar_fl").css({
					background: "#ffffff",
					color: "#222222"
				});
				node.find(".calenda_today").css({
					color: config.headColor
				});
				$(this).css({
					background: config.headColor,
					color: "#ffffff"
				});
				dataList.year = ynow;
				mnowTxt = mnow + 1;
				dnow = $(this).text();
				nowData = new Date(ynow, mnow, dnow);
				week = "周" + "日一二三四五六".split("")[nowData.getDay()];
				dataList.info = mnowTxt + "月" + dnow + "日" + "," + week;
				headShowNode.setData(dataList);
				buttonNode.setCallback(function() {
					console.log("点击日期");
				});
				
			})
			//鼠标滑过日期
			node.find(".calendar_fl").bind("mouseover", function() {
				$(this).find(".color_bg").css({
					background: config.headColor,
					opacity: "0.6",
					width: "28px",
					height: "28px",
					lineHeight: "28px",
					top: "0",
					left: "0",
					margin: "0"
				})
				$(this).find(".calender_txt").addClass("mouseover");
			})
			//鼠标滑出日期
			node.find(".calendar_fl").bind("mouseout", function() {
				$(this).find(".color_bg").css({
					background: "transparent",
					opacity: "1",
					width: "14px",
					height: "14px",
					lineHeight: "14px",
					top: "50%",
					left: "50%",
					margin: "-7px 0 0 -7px"
				}).removeClass("mouseover");
				$(this).find(".calender_txt").removeClass("mouseover");
			})
			//左右箭头隐藏
			if(startYear >= _year && mnow == startMonth) {
				_year = startYear;
				content.node.find(".prev_month").addClass("visibility_class");
				content.node.find(".prev_month").unbind("click");
				for(var i=0;i<startDay-1;i++){
					node.find(".calendar_fl").eq(i).find(".color_bg").addClass("visibility_class");
					node.find(".calendar_fl").eq(i).addClass("gray_class").unbind().find(".calender_txt").unbind();
				}
			} else if(endYear <= _year && mnow == endMonth) {
				_year = endYear;
				content.node.find(".next_month").addClass("visibility_class");
				for(var i=m_days[_mnow];i>=endDay;i--){
					node.find(".calendar_fl").eq(i).find(".color_bg").addClass("visibility_class");
					node.find(".calendar_fl").eq(i).addClass("gray_class").unbind().find(".calender_txt").unbind();
				}				
			} else {
				content.node.find(".prev_month").removeClass("visibility_class");
				content.node.find(".next_month").removeClass("visibility_class");
			};							

		}
	}
	//中部时间选择对象
	function TimeNode() {
		var content = this;
		var node = this.node = $('<div class="foot_box"><div class="data_select"><div class="data_select_left_wrap fl"><div class="data_select_left"></div></div><div class="data_select_right_wrap fl"><div class="data_select_right"></div></div></div><div class="tip">' + "鼠标移入左、右侧，滑动滚轮选择时间。" + '</div></div>');

		var leftNodeTop = -hnow * 30;
		var leftNodeTopPx = leftNodeTop + "px";
		var leftNodeNum = hnow + 2;
		var rightNodeTop = -minnow * 30;
		var rightNodeTopPx = rightNodeTop + "px";
		var rightNodeNum = minnow + 2;

		content.node.find(".data_select_left").css({
			top: leftNodeTopPx
		});
		content.node.find(".data_select_right").css({
			top: rightNodeTopPx
		});
		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		}
		this.setData = function() {
			node.find("button").css({
				color: config.headColor
			});
			content.appendTo(wrapNode);
			content.setNum();
			content.setTimeCss(".data_select_left .data_node", leftNodeNum);
			content.setTimeCss(".data_select_right .data_node", rightNodeNum);
		}
		this.show = function() {
			content.node.css({
				left: "0px"
			});
		}
		this.hide = function() {
			content.node.css({
				left: "300px"
			});
		}
		//设置展示数字
		this.setNum = function() {
			if(config.isHourOnly) {
				content.node.find(".data_select_left_wrap").css({
					width: "101%"
				});
				content.node.find(".tip").text("鼠标移入上方，滑动滚轮选择时间。");
				var indexNum = config.dataFormat.indexOf("h");
				config.dataFormat = config.dataFormat.slice(0, indexNum + 2) + ":00";
			}
			var num_left = 0;
			var i_num_left = 0;
			for(var i = -2; i <= 26; i++) {
				if(i < 0) {
					num_left = i + 24;
				} else if(i > 24) {
					num_left = i - 24;
				} else {
					num_left = i;
				}
				num_left < 10 ? num_left = "0" + num_left : num_left;
				var oneTimeNode = $('<div class="data_node">' + num_left + "时" + '</div>');
				oneTimeNode.appendTo(node.find(".data_select_left"));
			}
			for(var i = -2; i <= 62; i++) {
				var num_right = 0;
				if(i < 0) {
					num_right = i + 60;
				} else if(i > 60) {
					num_right = i - 60;
				} else {
					num_right = i;
				}
				num_right < 10 ? num_right = "0" + num_right : num_right;
				var oneTimeNode = $('<div class="data_node">' + num_right + "分" + '</div>');
				oneTimeNode.appendTo(node.find(".data_select_right"));
			}
		}
		//设置滚动效果
		this.setTimeCss = function(_node, _num) {
				content.node.find(_node).removeClass("data_node_center").removeClass("data_node_around");
				content.node.find(_node).eq(_num).addClass("data_node_center");
				content.node.find(_node).eq(_num - 1).addClass("data_node_around");
				content.node.find(_node).eq(_num + 1).addClass("data_node_around");
			}
			//左侧设置小时
		this.node.find(".data_select_left_wrap").hover(function() {
			if(document.addEventListener) {
				document.addEventListener('DOMMouseScroll', timeNode.scrollSelectHour, false);
			} //火狐  
			document.onmousewheel = timeNode.scrollSelectHour;
		}, function() {
			if(document.addEventListener) {
				document.removeEventListener('DOMMouseScroll', timeNode.scrollSelectHour, false);
			}
			document.onmousewheel = null;
		});
		//滚动获取小时
		this.scrollSelectHour = function(event) {
			var e = event || window.event;
			if(e.detail < 0 || e.wheelDelta > 0) { //向上滚动
				leftNodeTop >= 0 ? leftNodeTop = 0 : leftNodeTop += 30;
			} else { //向下滚动
				leftNodeTop <= -720 ? leftNodeTop = -720 : leftNodeTop -= 30;
			}
			leftNodeTopPx = leftNodeTop + "px";
			leftNodeNum = Math.abs(leftNodeTop / 30) + 2;
			content.node.find(".data_select_left").css({
				top: leftNodeTopPx
			});
			content.setTimeCss(".data_select_left .data_node", leftNodeNum);
		}; //IE/Opera/Chrome

		//右侧设置分钟
		this.node.find(".data_select_right_wrap").hover(function() {
			if(document.addEventListener) {
				document.addEventListener('DOMMouseScroll', timeNode.scrollSelectMin, false);
			} //火狐  
			document.onmousewheel = timeNode.scrollSelectMin;
		}, function() {
			if(document.addEventListener) {
				document.removeEventListener('DOMMouseScroll', timeNode.scrollSelectMin, false);
			} //火狐  
			document.onmousewheel = null;
		});
		//滚动获取分钟
		this.scrollSelectMin = function(event) {
			var e = event || window.event;
			if(e.detail < 0 || e.wheelDelta > 0) { //向上滚动
				rightNodeTop >= 0 ? rightNodeTop = 0 : rightNodeTop += 30;
			} else { //向下滚动
				rightNodeTop <= -1800 ? rightNodeTop = -1800 : rightNodeTop -= 30;
			}
			rightNodeTopPx = rightNodeTop + "px";
			rightNodeNum = Math.abs(rightNodeTop / 30) + 2;
			content.node.find(".data_select_right").css({
				top: rightNodeTopPx
			});
			content.setTimeCss(".data_select_right .data_node", rightNodeNum);
		}; //IE/Opera/Chrome

		//获得当前小时
		this.getHourTxt = function() {
				selectHour = content.node.find(".data_select_left .data_node.data_node_center").text();
				selectHour = parseInt(selectHour);
				return selectHour;
			}
			//获得当前分钟
		this.getMinTxt = function() {
			if(config.isHourOnly) {
				selectMinutes = 0;
			} else {
				selectMinutes = content.node.find(".data_select_right .data_node.data_node_center").text();
				selectMinutes = parseInt(selectMinutes);
			}
			return selectMinutes;
		}

	}
	//中部月份选择对象
	function MonthNode() {
		var content = this;
		var node = this.node = $('<div class="month_box hide"></div>');

		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		};
		this.setData = function() {
			content.appendTo(wrapNode);
			content.addMonthNode();
		};
		this.show = function() {
			clickMark = 1;
			content.node.find(".month_select_node_wrap").removeClass("visibility_class");
			content.node.removeClass("hide").removeClass("scale_box_lit").removeClass("scale_box_big_big").addClass("scale_box_big");
			content.node.find(".month_select_node").removeClass("gray_class").bind("click",content.clickMonth);	
			if(ynow==startYear){	
				for(var i=0;i<startMonth;i++){
					node.find(".month_select_node").eq(i).find(".month_select_node_wrap").addClass("visibility_class");
					node.find(".month_select_node").eq(i).addClass("gray_class").unbind("click");
				}
			}else if(ynow==endYear){
				for(var i=11;i>endMonth;i--){
					node.find(".month_select_node").eq(i).find(".month_select_node_wrap").addClass("visibility_class");
					node.find(".month_select_node").eq(i).addClass("gray_class").unbind("click");
				}
				
			}else{
				return ;
			}
		};
		this.hide = function() {
			content.node.removeClass("scale_box_lit").removeClass("scale_box_big").addClass("scale_box_big_big").addClass("hide");
		};

		this.addMonthNode = function() {
			for(var i = 1; i <= 12; i++) {
				var monthSelectNode = null;
				if(i == mnowTxt) {
					monthSelectNode = $('<div class="month_select_node"><div class="month_select_node_txt month_selected">' + i + "月" + '</div><div class="month_select_node_wrap"></div></div>');
					node.append(monthSelectNode.get(0));
				} else {
					monthSelectNode = (function() {
						var node = $("<div>").addClass("month_select_node");
						var node_txt = $("<div>").addClass("month_select_node_txt").text(i + "月");
						var node_wrap = $("<div>").addClass("month_select_node_wrap");
						node.append(node_txt.get(0)).append(node_wrap.get(0));
						return node;
					})();
					node.append(monthSelectNode.get(0));
				}
			}
			content.node.find(".month_selected").css({
				background: config.headColor,
				opacity: "0.9",
				color: "#fff"
			});
			//鼠标点击月
			this.node.find(".month_select_node").bind("click",content.clickMonth);
			this.clickMonth=function(){
				mnow = parseInt($(this).find(".month_select_node_txt").text()) - 1;
				content.hide();
				calendarNode.selectIsYM();
				calendarNode.showScale();
				buttonNode.show();
				clickMark = 0;				
			}


			//鼠标滑过月
			this.node.find(".month_select_node").bind("mouseover", function() {
				$(this).find(".month_select_node_wrap").css({
					borderStyle: "solid",
					borderWidth: "2px",
					borderColor: config.headColor,
					opacity: "0.6"
				});
			});
			//鼠标滑出月
			this.node.find(".month_select_node").bind("mouseout", function() {
				$(this).find(".month_select_node_wrap").css({
					borderStyle: "solid",
					borderWidth: "2px",
					borderColor: "#ffffff",
					opacity: "1"
				});
			});
		};

	}

	//中部年份选择对象
	function YearNode() {
		var content = this;
		var node = this.node = $('<div/>').addClass("year_box hide");
		var nodeWrap = $('<div/>').addClass("year_info_wrap");

		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		};
		this.setData = function() {
			content.appendTo(wrapNode);
			content.addYearNode();
			content.setYearTop();
		};
		this.show = function() {
			content.node.removeClass("hide").removeClass("scale_box_lit").removeClass("scale_box_big_big").addClass("scale_box_big");
		};
		this.hide = function() {
			content.node.removeClass("scale_box_lit").removeClass("scale_box_big").addClass("scale_box_big_big").addClass("hide");
		};
		this.addYearNode = function() {
			node.append(nodeWrap.get(0));
			for(var i = startYear; i <= endYear; i++) {
				var yearSelectNode = null;
				if(i == new Date().getFullYear()) {
					yearSelectNode = $('<div class="year_select_node"><div class="year_select_node_txt year_selected">' + i + '</div><div class="year_select_node_wrap"></div></div>');
					nodeWrap.append(yearSelectNode.get(0));
				} else {
					yearSelectNode = $('<div class="year_select_node"><div class="year_select_node_txt">' + i + '</div><div class="year_select_node_wrap"></div></div>');
					nodeWrap.append(yearSelectNode.get(0));
				}
			}
			content.node.find(".year_selected").css({
				background: config.headColor,
				opacity: "0.9",
				color: "#ffffff"
			});
			//鼠标点击年
			this.node.find(".year_select_node").bind("click", function() {
				ynow = parseInt($(this).find(".year_select_node_txt").text());
				content.hide();
				wrapNode.find(".calendar_txt_move").text(ynow + "年");
				monthNode.show();
				clickMark = 1;
			});

			//鼠标滑过年
			this.node.find(".year_select_node").bind("mouseover", function() {
				$(this).find(".year_select_node_wrap").css({
					borderStyle: "solid",
					borderWidth: "2px",
					borderColor: config.headColor,
					opacity: "0.6"
				});
			});
			//鼠标滑出年
			this.node.find(".year_select_node").bind("mouseout", function() {
				$(this).find(".year_select_node_wrap").css({
					borderStyle: "solid",
					borderWidth: "2px",
					borderColor: "#ffffff",
					opacity: "1"
				});
			});
		};
		this.setYearTop = function() {
			var yearTopNum = 0;
			var yearTopMax = Math.ceil((endYear - startYear) / 4) - 3;
			var yearScrollTopNum = 55 * Math.abs(yearTopNum);
			var yearScrollTop = -55 * yearScrollTopNum;
			if(new Date().getFullYear() - startYear >= 0 && new Date().getFullYear() - endYear <= 0) {
				yearTopNum = (new Date().getFullYear() + 1 - startYear) / 4;
				if(parseInt(yearTopNum) == yearTopNum) {
					yearTopNum = parseInt(yearTopNum) - 1;
				} else {
					yearTopNum = parseInt(yearTopNum);
				}
				(yearTopMax+3-yearTopNum)<=3?yearTopNum=yearTopMax:yearTopNum=yearTopNum;
				yearTopNum<0?yearTopNum=0:yearTopNum=yearTopNum;
				content.node.find(".year_info_wrap").css({
					top: -yearTopNum * 55
				});
			}
			content.node.hover(function() { //对div的处理 
				if(document.addEventListener) {
					document.addEventListener('DOMMouseScroll', scrollSelectYear, false);
				} //火狐  		
				document.onmousewheel = document.onmousewheel = scrollSelectYear;
			}, function() {
				if(document.addEventListener) {
					document.removeEventListener('DOMMouseScroll', scrollSelectYear, false);
				} //火狐  		
				document.onmousewheel = null;
			});

			function scrollSelectYear(event) {
				if(yearTopMax>=0){
					var e = event || window.event;
					if(clickMark == 2) {
						if(e.detail < 0 || e.wheelDelta > 0) { //向上滚动
							yearTopNum--;
							yearTopNum <= 0 ? yearTopNum = 0 : yearTopNum = yearTopNum;
						} else { //向下滚动
							yearTopNum++;
							yearTopNum >= yearTopMax ? yearTopNum = yearTopMax : yearTopNum = yearTopNum;
						}
						nodeWrap.css({
							top: -yearTopNum * 55
						});
					}	
				}else{
					return ;
				}
			}; //IE/Opera/Chrome			

		}
	}
	//下部日历操作对象
	function ButtonNode() {
		var content = this;
		var callback = null;
		var node = this.node = $('<div class="btn_box"><button class="go_back_btn hide">' + "返回" + '</button><button class="make_sure_btn hide">' + "确定" + '</button><button class="ok_btn hide">' + "确定" + '</button><button class="cancel_btn">' + "取消" + '</button></div>');
		this.appendTo = function(_jq) {
			$(_jq).append(content.node.get(0));
		}
		this.setData = function() {
			node.find("button").css({
				color: config.headColor
			});
			content.appendTo(wrapNode);
		}
		this.hide = function() {
			content.node.hide();
		}
		this.show = function() {
			content.node.show();
		}
		//回调函数
		this.setCallback = function(_callback) {
			callback = _callback;
		};
		this.getCallback = function() {
			return callback;
		};

		//第一次点击确定
		this.node.find(".make_sure_btn").bind("click", function() {
			if(typeof(callback) === "function") {
				content.node.find(".go_back_btn").removeClass("hide");
				content.node.find(".make_sure_btn").addClass("hide");
				content.node.find(".ok_btn").removeClass("hide");
				calendarNode.hide();
				timeNode.show();
				$(config.inputId).val(wrapContent.formatDate());
			} else {
				return;
			}
		})
		//第二次点击确定
		this.node.find(".ok_btn").bind("click", function() {
			if(typeof(callback) === "function") {
				content.node.find(".ok_btn").addClass("hide");
				content.node.find(".make_sure_btn").removeClass("hide");
				wrapContent.hide();
				timeNode.getHourTxt();
				timeNode.getMinTxt();
				$(config.inputId).val(wrapContent.formatDate());
				if(typeof(config.callback) === "function") {
					config.callback(wrapContent.getNowTime());
				}
			} else {
				return;
			}
		})

		//点击取消
		this.node.find(".cancel_btn").bind("click", function() {
			wrapContent.hide();
		})
		//点击返回
		this.node.find(".go_back_btn").bind("click", function() {
			calendarNode.show();
			timeNode.hide();
			content.node.find(".make_sure_btn").removeClass("hide");
			content.node.find(".ok_btn").addClass("hide");
			content.node.find(".go_back_btn").addClass("hide");
		})
	}
	boxWrap.bind("click", function() {
		wrapContent.hide();
	})
	wrapNode.bind("click", function(event) {
		event.stopPropagation();
	})

	$(config.inputId).bind("click", function() {
		wrapContent.show();
		wrapContent.setInstall(formatMark);
	})
}