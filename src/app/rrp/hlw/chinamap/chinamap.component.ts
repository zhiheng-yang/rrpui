import {Component, OnInit, Output, ViewChild, ElementRef, EventEmitter} from '@angular/core';
import * as echarts from 'echarts';
import 'echarts/map/js/province/shandong.js';
import 'echarts/map/js/china.js';
import 'echarts/map/js/province/anhui.js';
import 'echarts/map/js/province/aomen';
import 'echarts/map/js/province/beijing';
import 'echarts/map/js/province/hainan';
import 'echarts/map/js/province/xianggang';
import 'echarts/map/js/province/taiwan';
import 'echarts/map/js/province/tianjin';
import 'echarts/map/js/province/chongqing';
import 'echarts/map/js/province/fujian';
import 'echarts/map/js/province/gansu';
import 'echarts/map/js/province/guangdong';
import 'echarts/map/js/province/guangxi';
import 'echarts/map/js/province/guizhou';
import 'echarts/map/js/province/hebei';
import 'echarts/map/js/province/heilongjiang';
import 'echarts/map/js/province/henan';
import 'echarts/map/js/province/jiangsu';
import 'echarts/map/js/province/jiangxi';
import 'echarts/map/js/province/jilin';
import 'echarts/map/js/province/liaoning';
import 'echarts/map/js/province/hubei';
import 'echarts/map/js/province/neimenggu';
import 'echarts/map/js/province/ningxia';
import 'echarts/map/js/province/qinghai';
import 'echarts/map/js/province/shanghai';
import 'echarts/map/js/province/shanxi';
import 'echarts/map/js/province/sichuan';
import 'echarts/map/js/province/xinjiang';
import 'echarts/map/js/province/xizang';
import 'echarts/map/js/province/yunnan';
import 'echarts/map/js/province/zhejiang';
import 'echarts/map/js/province/hunan';
import {QuerylistService} from '../../../helpcenter/querylist/querylist.service';
@Component({
  selector: 'app-chinamap',
  templateUrl: './chinamap.component.html',
  styleUrls: ['./chinamap.component.css']
})
export class ChinamapComponent implements OnInit {

  @ViewChild('map', {static: false}) chartMap: ElementRef;
  constructor(private querylisthelp: QuerylistService) {
  }
  regionOptions;
  chinaOptions;
  ProvinceData;
  CityData;
  num = 0;
  data;
  selectProvinceData;
  cityCompany;

  header; // 测试
  footer = '生产数据汇总图表';
  @Output() voted = new EventEmitter<boolean>();
// 向父组件发射 一个boolean型的参数 agreed
  vote(agreed: boolean) {
    this.voted.emit(agreed);
  }
  ngOnInit() {
    this.num = 0;
    this.querylisthelp.getCity().then((res: any) => this.CityData = res.data);
    this.querylisthelp.getProvince().then((res: any) => {
      this.ProvinceData = res.data;
      this.data = res.data;
      for (const obj of res.data) {
        if (obj.value > 0) {
          this.num  += obj.value;
        }
      }
      console.log(this.num);
      this.header = '各省地图|布料机器人分布';
      this.chinaOptions = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}：{c}'
        },
        visualMap: {
          min: 0,
          max: 80,
          realtime: false,
          inRange: {
            color: ['#44608b', '#e66b00']
          }
        },
        series: [
          {
            type: 'map',
            mapType: 'china',  //  与注册时的名字保持统一   echarts.registerMap('China', geoJson);
            aspectScale: 0.75, // 长宽比
            map: 'china',
            geoIndex: 1,
            showLegendSymbol: false, // 存在legend时显示
            itemStyle: {
              normal: {
                areaColor: '#44608b',
                borderColor: '#9ffcff',
                shadowColor: 'rgba(0,54,180, 0.9)',
                shadowBlur: 50,
                label: { show: true, color: 'white' }
              },
              emphasis: {
                areaColor: '#A5DABB'
              }
            },
            zoom: 1.1,
            data: this.ProvinceData
          }
        ]
      };
      this.regionOptions = this.chinaOptions;
      const echart = echarts.init(document.getElementById('map')); // 获取视图的echarts的DOM节点，并初始化对象
      echart.on('click', function(obj) { // 绑定地图点击事件
        if (obj.data != null)  {
          if (!(obj.name.includes('市') || obj.name.includes('州') || obj.name.includes('区'))) {
            this.num = 0;
            this.selectProvinceData = this.ProvinceData.filter(t => t.name === obj.name)[0];
            this.regionOptions = {
              tooltip: {
                trigger: 'item',
                formatter: '{b}:{c}'
              },
              visualMap: {
                min: 0,
                max: 20,
                realtime: false,
                inRange: {
                  color: ['#44608b', '#44608b', '#0d98bb', '#e69805']
                }
              },
              series: [
                {
                  type: 'map',
                  mapType: obj.name,  //  与注册时的名字保持统一   echarts.registerMap('China', geoJson);
                  aspectScale: 0.75, // 长宽比
                  itemStyle: {
                    normal: {
                      areaColor: '#44608b',
                      borderColor: 'white',
                      label: { show: true, color: 'white' }
                    },
                    emphasis: {
                      areaColor: '#A5DABB'
                    }
                  },
                  zoom: 1.1,
                  data: this.CityData
                }
              ]
            };
            this.header = obj.name + '|布料机器人分布';
            this.data = this.CityData.filter(t => t.provinceid === this.selectProvinceData.provinceid);
            for (let obj of this.data) {
              if (obj.value > 0) {
                this.num = this.num + obj.value;
              }
            }
          }
          if (obj.name.includes('市') || obj.name.includes('州') || obj.name.includes('区')) {
            console.log(obj.data)
            this.getLease(obj.data.name);
          }
        }
      }.bind(this));
    });
  }
  returnchina() {
    this.querylisthelp.getProvince().then((res: any) => {
      this.num = 0;
      this.data = res.data;
      this.regionOptions = this.chinaOptions;
      this.header = '各省地图|布料机器人分布';
      this.cityCompany = undefined;
      for (const obj of res.data) {
        if (obj.value > 0) {
          this.num  += obj.value;
        }
      }
    });
  }

  getLease(data) {
    this.querylisthelp.getLeaseByCity(data).then((res:any)=>{
      this.cityCompany = res.data;
      this.header = data + '|布料机器人分布';
    })
  }


}
