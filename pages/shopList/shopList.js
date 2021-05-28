// pages/shopList/shopList.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		query:{},
		shopList:[],
		page:1,
		pageSize:10,
		total:0,
		isLoading:false	// 节流阀
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 获取页面参数 {id: "1", title: "美食"}
		console.log(options);
		this.setData({
			query:options
		})
		this.getShopList()
	},
	getShopList(cb){
		this.data.isLoading=true
		// 展示 loading
		wx.showLoading({
			title:'加载中'
		})
		wx.request({
			url: `https://www.escook.cn/categories/${this.data.query.id}/shops`,
			method:'GET',
			data:{
				_page:this.data.page,
				_limit:this.data.pageSize
			},
			success:(res)=>{
				console.log(res);
				this.setData({
					shopList:[...this.data.shopList,...res.data],
					total:+res.header['X-Total-Count']
				})
			},
			complete:()=>{
				wx.hideLoading()
				this.data.isLoading=false
				// 关闭下拉刷新
				// wx.stopPullDownRefresh()
				cb && cb()
			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title:this.data.query.title
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		// 重置关键数据
		this.setData({
			shopList:[],
			page:1,
			total:0
		})
		this.getShopList(()=>{
			wx.stopPullDownRefresh()
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		// console.log('上拉触底');
		// 判断是否还有下一页数据
		if(this.data.page*this.data.pageSize>=this.data.total){
			return wx.showToast({
				title:'没有更多数据了',
				icon:'none'
			})
		}
		if(this.data.isLoading) return 
		this.setData({
			page:this.data.page+1
		})
		this.getShopList()
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})