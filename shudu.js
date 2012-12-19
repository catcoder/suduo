// JavaScript Document
(function($){
	/*
	*@param content:内容字符串，从左到右从上到下，空白处为0，有数字的地方为正常数字。一共81个数
	*@param emId:元素Id
	*/
	$.fn.shudu = function(content,emId){
		var _content = content;
		var isEdit = false;
		var _canEditBC = "#fafafa"; //可编辑区背景色
		var _noEditBC = "#e8e8ff"; //不可编辑区背景色
		
		if(!_content.match("^[0-9]{81}$")){return;}
		
		$(emId).addClass("shudu");	
		
		//绘制方框
		var _strDiv = "<input type='text' value='{1}' id='c{0}' l='{2}' h='{3}' b='{4}' isE='f' />";
		var _id = "00";
		var _temEm = "";
		var _temnum = "";
		var _temL = 0;
		var _temH = 0;
		var _temB = 0;
		for(var i = 0; i < 81; i++){
			_temEm = _strDiv.replace("{0}", i);
			_temnum = _content.charAt(i);
			
			_temL = parseInt(i / 9);
			if(_temH == 9){
				_temH = 0;
			}
			
			if(_temL <= 2){
				if(_temH <= 2){
					_temB = 0;
				}else if(_temH <= 5){
					_temB = 1;
				}else if(_temH <= 8){
					_temB = 2;
				}
			}else if(_temL <= 5){
				if(_temH <= 2){
					_temB = 3;
				}else if(_temH <= 5){
					_temB = 4;
				}else if(_temH <= 8){
					_temB = 5;
				}
			}else if(_temL <= 8){
				if(_temH <= 2){
					_temB = 6;
				}else if(_temH <= 5){
					_temB = 7;
				}else  if(_temH <= 8){
					_temB = 8;
				}
			}
			
			if(_temnum == "0"){
				_temnum = "";
			}else{
				_temEm = _temEm.replace("input", "input readonly='readonly' style='background:#e8e8ff;'");
			}
			
			_temEm = _temEm.replace("{1}", _temnum);
			_temEm = _temEm.replace("{2}", _temL);
			_temEm = _temEm.replace("{3}", _temH);
			_temH++;
			_temEm = _temEm.replace("{4}", _temB);
			
			$(emId).append(_temEm);
		}
		
		//画小九宫格		
		for(i = 2; i < 6; i += 3){
			for(var j = 0; j < 9; j++){
				_id = "#c" + ((i * 9) + j).toString();
				$(_id).css("border-bottom-width", "1px").css("border-bottom-style","solid").css("border-bottom-color","#0CF");
			}
		}
		
		for(i = 2; i < 6; i += 3){
			for(j = 0; j < 9; j++){
				_id = "#c" + ((j * 9) + i).toString();
				$(_id).css("border-right-width", "1px").css("border-right-style","solid").css("border-right-color","#0CF");
			}
		}
		//添加事件
		var _emInput = emId + " input";
		var _chanBC;
		$(_emInput).bind("mouseenter", function(){			
			_chanBC = $(this).css("background")
			if($(this).attr("readonly") == "readonly"){return false;}
			$(this).css("background", "#C5F3D3");	
		});		
		
		$(_emInput).bind("mouseleave", function(){
				$(this).css("background", _chanBC);
		});
		
		//键盘按下事件，过滤无用键
		$(_emInput).bind("keydown", function(e){
			if($(this).attr("readonly") == "readonly"){return;}
			var keyc = e.keyCode;
			
			if(keyc > 36 && keyc < 41){
				var _temLid = $(this).attr("id").substr(1);
				var _temId = "";
					
				if(keyc == 37){
					//left
					for(i = _temLid - 1; i >= 0; i--){
						_temId = "#c" + i;
						if($(_temId).attr("readonly") != "readonly"){
							$(this).css("background", "#fafafa");
							$(_temId).focus();
							$(_temId).css("background", "#C5F3D3");	
							return false;
						}
					}
				}else if(keyc == 38){
					//up
					for(i = _temLid -9; i >= 0; i-=9){
						_temId = "#c" + i;
						if($(_temId).attr("readonly") != "readonly"){
							$(this).css("background", "#fafafa");
							$(_temId).focus();
							$(_temId).css("background", "#C5F3D3");	
							return false;
						}
					}
				}else if(keyc == 39){
					//right
					_temLid = parseInt(_temLid);
					for(i = _temLid + 1; i < 81; i++){
						_temId = "#c" + i;						
						if($(_temId).attr("readonly") != "readonly"){
							$(this).css("background", "#fafafa");
							$(_temId).focus();
							$(_temId).css("background", "#C5F3D3");	
							return false;
						}
					}
				}else if(keyc == 40){
					//down
					_temLid = parseInt(_temLid);
					for(i = _temLid + 9; i < 81; i+=9){
						_temId = "#c" + i;
						if($(_temId).attr("readonly") != "readonly"){
							$(this).css("background", "#fafafa");
							$(_temId).focus();
							$(_temId).css("background", "#C5F3D3");	
							return false;
						}
					}
				}		
			}
			if(!((keyc > 96 && keyc < 106) || (keyc > 48 && keyc < 58))){return false;}			
			
			if(isEdit){
			}else{
				$(this).val("");
			}
		});	
		
		$(_emInput).bind("keyup", function(e){
			//判断是否有重复
			var keyc = e.keyCode;
			if(!((keyc > 96 && keyc < 106) || (keyc > 48 && keyc < 58))){return false;}
			
			var _temw = $(this).attr("value");
			var _temId = "#" + $(this).attr("id");
			_aHadR = new Array();
			
			//判断小九宫格
			checkNum(emId, "b", _temId)
			//判断横排
			checkNum(emId, "l", _temId);
			//判断竖排
			checkNum(emId, "h", _temId)
			
			
		});
		
	}
	
	//--------------------------------------------------------------
	//检测所更改小格的错误格子是否消除
	var checkNum = function(emId, ele, cid){
		var _temw = $(cid).attr("value");
		var _aHadT = new Array();
		var _temId = $(cid).attr("id");
		_aHadT.push(_temId);
		var _temSame = emId + " input[" + ele + "='" + $(cid).attr(ele) + "']";
		
		$(_temSame).each(function(){			
			  if($(this).attr("id") != _temId){
				  if($(this).val() == _temw){
					  $(cid).css("color", "red").attr("isE", "t");		
					  $(this).css("color", "red").attr("isE", "t");		
				  }else{
					  if($(this).attr("isE") == "t"){
						  _aHadT.push($(this).attr("id"));
					  }
				  }				
			  }
		});
		
		var _temCheckId;
		var _temCNum = 0;
		for(var i = 0; i < _aHadT.length; i++){
			_temCheckId = "#" + _aHadT[i];
			_temCNum = 0;
			
			$(_temSame).each(function(){
					if($(_temCheckId).val() == $(this).val()){
						_temCNum++;
					}
			});
			
				
			if(_temCNum == 1){
				var _temIsC = false;
				
				if(ele == "b"){
					_temCNum = checkOther(emId, _temCheckId, "l", _temCNum);
					_temCNum = checkOther(emId, _temCheckId, "h", _temCNum);
					if(_temCNum == 3){
						_temIsC = true;
					}
				}else if(ele == "l"){
					_temCNum = checkOther(emId, _temCheckId, "b", _temCNum);
					_temCNum = checkOther(emId, _temCheckId, "h", _temCNum);
					if(_temCNum == 3){
						_temIsC = true;
					}
				}else if(ele == "h"){
					_temCNum = checkOther(emId, _temCheckId, "b", _temCNum);
					_temCNum = checkOther(emId, _temCheckId, "l", _temCNum);
					if(_temCNum == 3){
						_temIsC = true;
					}
				}
				if(_temIsC){
					$(_temCheckId).css("color", "#000").attr("isE", "f");
				}
			}
		}
	}
	//---------------------------------------------------------------------------------------
	//检测更改小格影响范围内的相同值得数目
	var checkOther = function(emId, checkId, ele, _temCNum){
		$(emId + " input[" + ele + "='" + $(checkId).attr(ele) + "']").each(function() {
			if($(checkId).val() == $(this).val()){
				_temCNum++;
			}
         });
		 return _temCNum;
	}
})(jQuery)

