// index.js
const getCenter = require("../../utils/getCenter.js");
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// 获取应用实例
Page({
  /**
   * 页面的初始数据
   */
  data: {
    regionlocation:[{
        longitude: 112.2228,
        latitude: 31.004758
      }, {
        longitude: 112.186579,
        latitude: 31.011673
      }, {
        longitude: 112.172331,
        latitude: 30.997548
      }, {
        longitude: 112.160143,
        latitude: 30.976945
      }, {
        longitude: 112.210268,
        latitude: 30.956632
      }
    ],
    longitude: 0,
    latitude: 0,
    polygons:[],
    top: 0,
    left: 0,
    address: ''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 创建mapCtx，在方法includePoints()中需要使用。由于onReady在onLoad后执行，不能在onReady中创建MapContext.
    this.mapCtx = wx.createMapContext('myMap');

    // 缩放视野展示所有点的经纬度
    this.includePoints();

    // 多边形
    var polygons_temp = [{
      points: this.data.regionlocation,
      strokeWidth:2,
      strokeColor:"#FF000010",
      fillColor:"#FF000020"
    }];
    this.setData({
      polygons: polygons_temp
    });

    // 计算多边形的中心点，作为地图map的中心经纬度
    var center = getCenter.getCenter(this.data.regionlocation);
    this.setData({
      longitude: center.longitude,
      latitude: center.latitude
    })

    // 设置中心图标的位置，中心图标的位置和center保持一致
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    let top = windowHeight / 2 - 36;    // 36为图标的大小
    let left = (windowWidth - 36) / 2;
    this.setData({
      top: top,
      left: left
    })

  },

  /**
   * 视野发生变化时触发
   */
  regionChange: function(res) {
    // var that = this;
    // 改变中心点
    if(res.type == 'end') {
      this.getCenterLocation();
    }
  },


  /**
   * 缩放视野展示所有点的经纬度
   */
  includePoints: function() {
    // console.log("includePoints");
    // 缩放视野展示所有点的经纬度
    this.mapCtx.includePoints({
      padding:['30'],
      points: this.data.regionlocation
    })
  },

  /**
   * 获取中心点
   */
  getCenterLocation: function() {
    var that = this;
    var qqmapsdk = new QQMapWX({
      key: 'WMUBZ-QWQ3F-74DJ6-JVH5X-HY3EJ-UIBMV'
    });
    // step 1 查询中心点
    this.mapCtx.getCenterLocation({
      success: function(res) {
        let lat = res.latitude;
        let lot = res.longitude;
        // step 2 逆地理位置信息描述
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lot
          },
          success: function(res) {
            let address_temp = '';
            if (res.status == 0) {
              address_temp = res.result.formatted_addresses.recommend
            } else {
              address_temp = '未获取到详细位置信息，请重试！'
            }
            // console.log(address_temp);
            that.setData({
              address: address_temp
            })
          },
          fail: function(error) {
            console.error(error)
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.mapCtx = wx.createMapContext('myMap');
    // console.log(this.mapCtx.includePoints);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.mapCtx.includePoints);
    
  }
})
