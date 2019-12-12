<template>
	<div id="Cart">
		<el-row class="top-select lineOne" :gutter="5">
			<el-col :span="8" class="line-one">
				<el-select v-model="theDate.gameid" placeholder="游戏名称">
					<el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8" class="line-one">
				<el-select v-model="theDate.areaid" placeholder="游戏社区">
					<el-option v-for="item in areaList" :key="item.id" :label="item.areaname" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8" class="line-one">
				<el-select v-model="theDate.groupid" placeholder="商品分组">
					<el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8">
				<el-select v-model="theDate.equipmenttypeid" placeholder="装备类型">
					<el-option v-for="item in typeList" :key="item.id" :label="item.typename" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
			<el-col :span="8">
				<el-select v-model="theDate.equipmentnameid" placeholder="装备名称">
					<el-option v-for="item in nameList" :key="item.id" :label="item.equipmentname" :value="item.id">
					</el-option>
				</el-select>
			</el-col>
		</el-row>
		<el-form :inline="true" class="demo-form-inline">
			<el-form-item :label="item1.labeltext" v-for="(item1, index) in propertyList">
				<el-select v-model="theDate[''+item1.inputname]" placeholder="请选择">
					<el-option v-for="item2 in item1.inputvalue.split(',')" :key="item2" :label="item2" :value="item2">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import QRCode from "qrcodejs2";
	export default {
		name: 'Cart',

		data() {
			return {
				theDate: {
					gameid: "",
					areaid: "",
					groupid: "",
					equipmenttypeid: "",
					equipmentnameid: "",
				},
				areaList: [],
				groupList: [],
				typeList: [],
				gameList: [],
				nameList: [],
				drawer: false,
				propertyList: [],
			}
		},
		methods: {
			//获取游戏名称
			getGameList: function() {
				this.$ajax.get("game/gameList", {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.gameList = data.content;
							this.theDate.gameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.gameList = [];
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取区域名称
			getAreaList: function() {
				this.$ajax.get("game/areaList?gameId=" + this.theDate.gameid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.areaList = data.content;
							this.theDate.areaid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.areaList = [];
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取分类
			getGroupList: function() {
				this.$ajax.get("property/groupList?gameId=" + this.theDate.gameid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.groupList = data.content;
							this.theDate.groupid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.groupList = [];
							this.theDate.groupid = "";
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取装备类型
			getTypeList: function() {
				this.$ajax.get("property/typeList?groupId=" + this.theDate.groupid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.typeList = data.content;
							this.theDate.equipmenttypeid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.typeList = [];
							this.theDate.equipmenttypeid = "";
							this.nameList = [];
							this.theDate.equipmentnameid = "";
							this.noListWarn = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取装备名称
			getNameList: function() {
				this.$ajax.get("property/nameList?typeId=" + this.theDate.equipmenttypeid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.nameList = data.content;
							this.theDate.equipmentnameid = data.content[0].id;
						} else if(data.code == 1000 && data.content == 0) {
							this.nameList = [];
							this.theDate.equipmentnameid = "";
							this.nameList = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
			//获取属性列表
			getPropertyList: function() {
				this.theDate = JSON.parse(JSON.stringify(this.theDate, ['gameid', 'areaid', 'groupid', 'equipmenttypeid', 'equipmentnameid']));
				this.$ajax.get("property/propertyList?typeId=" + this.theDate.equipmenttypeid, {
						timeout: 1000 * 5
					})
					.then((data) => {
						console.log(data);
						if(data.code == 1000 && data.content.length > 0) {
							this.propertyList = data.content;

						} else if(data.code == 1000 && data.content == 0) {
							this.propertyList = [];
							this.nameList = true;
						} else {
							this.$parent.layerTimeout(data.msg);
							return false
						}
					})
			},
		},
		watch: { //
			'theDate.gameid' (val) {
				if(val) {
					this.getAreaList();
					this.getGroupList();
				}

			},
			'theDate.areaid' (val) {

			},
			//
			'theDate.groupid' (val) {
				if(val) {
					this.getTypeList();
					this.initGetGoods();
				}
			},
			//
			'theDate.equipmenttypeid' (val) {
				if(val) {
					this.getNameList();
					this.getPropertyList();
				}
			},
			'theDate.equipmentnameid' (val) {
				if(val) {
					this.initGetGoods();
				}
			},
		},
		beforeRouteLeave(to, from, next) {

			next()
		},
		created() {
			this.isFirstEnter = true;
		},
		activated() {
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
		},
		mounted() {
			this.$parent.getBasicUrlFun(this.getGameList);
			this.$route.meta.needReload = true;
		}
	}
</script>

<style>
	#Cart .lineOne .line-one {
		margin-bottom: 5px;
	}
	
	#Cart .demo-form-inline{
		padding: 10px;
	}
</style>