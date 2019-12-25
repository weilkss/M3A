const datas = {
  shareCover: 'cloud://prod-b29ch.7072-prod-b29ch-1300731124/img/share.jpg',
  tabs: [{
    id: 1,
    name: '全部'
  }, {
    id: 2,
    name: '帖子'
  }, {
    id: 3,
    name: '视频'
  },
    //  {
    //   id: 4,
    //   name: '活动'
    // },
    //  {
    //   id: 5,
    //   name: '问答'
    // }
  ],
  screenLists: [{
    id: 1,
    name: '最新发布'
  }, {
    id: 2,
    name: '人气最高'
  }],
  imgTypes: ['聚会', '驭驾游', '聚餐', '车展', '篮球', '其他'],
  option: {
    title: {
      text: '',
    },
    color: ["#f40000"],
    legend: {
      data: ['A'],
      top: 10,
      left: 'center',
      backgroundColor: 'red',
      z: 100
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
    },
    series: [{
      name: 'A',
      type: 'line',
      smooth: true,
      data: [],
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#999',
              fontSize: 12
            }
          }
        }
      },
    }]
  }
}


export default datas