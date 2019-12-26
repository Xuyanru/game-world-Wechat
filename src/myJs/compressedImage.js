import Vue from 'vue';
import EXIF from "exif-js";
Vue.use(EXIF);
//	压缩图片
export function compressedImage(theSrc, callBack) {
	var image = new Image();
	image.src = theSrc;
	image.onload = function() {
		var expectWidth = this.naturalWidth;
		var expectHeight = this.naturalHeight;
		console.log(expectWidth);
		if (this.naturalWidth > 500) {
			expectWidth = 500;
			expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
		}

		//			if(this.naturalWidth > this.naturalHeight && this.naturalWidth > 500) {
		//				expectWidth = 500;
		//				expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
		//			} else if(this.naturalHeight > this.naturalWidth && this.naturalHeight > 600) {
		//				expectHeight = 600;
		//				expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
		//			}
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = expectWidth;
		canvas.height = expectHeight;
		ctx.drawImage(image, 0, 0, expectWidth, expectHeight);
		var base64 = null;
		base64 = canvas.toDataURL("image/jpeg", 0.5);
		console.log(base64);
		callBack(base64);
	};
}

export function selImgCon(e,callback) {
	var file = e.target.files['0'];
	//图片方向角 added by lzk
	var Orientation = null;

	if (file) {
		var oReader = new FileReader();
		oReader.onload = function(e) {
			//var blob = URL.createObjectURL(file);
			//_compress(blob, file, basePath);
			var image = new Image();
			image.src = e.target.result;
			image.onload = function() {
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = this.naturalWidth;
				canvas.height = this.naturalHeight;
				ctx.drawImage(this, 0, 0);
				//如果方向角不为1，都需要进行旋转 added by lzk

				let promise = new Promise((resolve, reject) => {
					EXIF.getData(file, function() {
						Orientation = EXIF.getTag(this, 'Orientation');
						resolve(Orientation)
					})
				})
				promise.then((Orientation) => {
					if (Orientation != "" && Orientation != 1) {
						//							alert('旋转处理');
						switch (Orientation) {
							case 6: //需要顺时针（向左）90度旋转
								//									alert('需要顺时针（向左）90度旋转');
								rotateImg(this, 'left', canvas);
								break;
							case 8: //需要逆时针（向右）90度旋转
								//									alert('需要顺时针（向右）90度旋转');
								rotateImg(this, 'right', canvas);
								break;
							case 3: //需要180度旋转
								//									alert('需要180度旋转');
								rotateImg(this, 'right', canvas); //转两次
								rotateImg(this, 'right', canvas);
								break;
						}
					}

					var base64 = canvas.toDataURL("image/jpeg", 0.8);
					console.log(base64);
					if(callback){
						callback(base64)
					}
				})
			};
		};
		oReader.readAsDataURL(file);
	}
}

//对图片旋转处理 added by lzk
export function rotateImg(img, direction, canvas) {
	//alert(img);
	//最小与最大旋转方向，图片旋转4次后回到原方向  
	var min_step = 0;
	var max_step = 3;
	//var img = document.getElementById(pid);  
	if (img == null) return;
	//img的高度和宽度不能在img元素隐藏后获取，否则会出错  
	var height = img.height;
	var width = img.width;
	//var step = img.getAttribute('step');  
	var step = 2;
	if (step == null) {
		step = min_step;
	}
	if (direction == 'right') {
		step++;
		//旋转到原位置，即超过最大值  
		step > max_step && (step = min_step);
	} else {
		step--;
		step < min_step && (step = max_step);
	}
	//旋转角度以弧度值为参数  
	var degree = step * 90 * Math.PI / 180;
	var ctx = canvas.getContext('2d');
	switch (step) {
		case 0:
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(img, 0, 0);
			break;
		case 1:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, 0, -height);
			break;
		case 2:
			canvas.width = width;
			canvas.height = height;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, -height);
			break;
		case 3:
			canvas.width = height;
			canvas.height = width;
			ctx.rotate(degree);
			ctx.drawImage(img, -width, 0);
			break;
	}
}
