import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BoardCount} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {DhbslService} from '../service/dhbsl.service';
import {QuerylistService} from "../../../helpcenter/querylist/querylist.service";

@Component({
  selector: 'app-dhbsl',
  templateUrl: './dhbsl.component.html',
  styleUrls: ['./dhbsl.component.css']
})
export class DhbslComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  begin: Date;
  // tslint:disable-next-line:variable-name
  end: Date;
  dateFormat = 'yyyy/MM/dd';
  benchCounts: BoardCount[];
  isCollapse = false;
  selectedCompany;
  CompanyData;
  selectedRobot;
  RobotData;
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private querylistService: QuerylistService,
    private dhbslService: DhbslService
  ) {
  }

  ngOnInit() {
    this.getDhbsl();
    this.getCompany();
  }

  getDhbsl(): void {
    // tslint:disable-next-line:variable-name
    let date_begin = '1020-04-23';
    // tslint:disable-next-line:variable-name
    let date_end = '3020-04-30';
    if (this.begin !== undefined) {
      // tslint:disable-next-line:variable-name
      date_begin = this.datePipe.transform(this.begin, 'yyyy-MM-dd');
      // tslint:disable-next-line:variable-name
      date_end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }
    if (this.selectedRobot !== undefined) {
    }
    this.dhbslService.getBoardCounts(date_begin, date_end, this.selectedRobot === undefined ? null : this.selectedRobot.id)
      .subscribe((res: any) => {
        this.benchCounts = res.data;
        const countNum = [];
        const time = [];
        for (const benchCount of this.benchCounts) {
          countNum.push(benchCount.count);
          // tslint:disable-next-line:variable-name
          const time_str = this.datePipe.transform(benchCount.time, 'yyyy年MM月dd日');
          time.push(time_str);
        }
        // @ts-ignore
        const highCharts = require('highCharts');
        // @ts-ignore
        require('highcharts/modules/exporting')(highCharts);
        // 创建图表
        highCharts.setOptions({
          colors: ['#5d93ff', '#5381df', '#486dbe', '#425fa6' , '#38508c', '#334a80', '#2e4274'],
        });
        highCharts.chart('container', {
          chart: {
            type: 'column',
            backgroundColor: '#1e2340',
            plotShadow: true,
          },
          title: {
            text: this.selectedRobot === undefined ? '叠合板总数量' : '',
            style: {
              color: '#b1b1b1'
            },
          },
          xAxis: {
            categories: time,
            crosshair: true
          },
          yAxis: {
            min: 0,
            title: {
              text: '叠合板数量（块）',
              style: {
                color: '#b1b1b1'
              },
            },
            labels: {
              style: {
                color: '#b1b1b1'
              },
            },
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} 块</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              shadow: true,
              colorByPoint: true
            }
          },
          time: {
            enabled: false
          },
          series: [{
            name: '叠合板数量',
            data: countNum
          }]
        });
      });


  }
  @Output() onQuery: EventEmitter<any> = new EventEmitter<any>();

  query() {
    const data = {
      company: '',
      robot: ''
    };
    data.company = this.selectedCompany;
    data.robot = this.selectedRobot;
    this.onQuery.emit(data);
  }

  getCompany() {
    this.querylistService.getCompany().then((res: any) => {
      this.CompanyData = res.data;
    });
  }

  getRobot(id) {
    this.querylistService.getRobot(id).then((res: any) => {
      this.RobotData = res.data;
    });
  }

  // 展开/关闭
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;

  }

  CompanyChange(data) {
    this.selectedCompany = data;
    this.getRobot(data.id);
  }

  RobotChange(data) {
    this.selectedRobot = data;
  }

  reset() {
    this.selectedCompany = undefined;
    this.selectedRobot = undefined;
  }

  onquery(data) {
    console.log(data);

    // 参数赋值
    if (data.startdate) {
      this.begin = data.startdate;
    }
    if (data.enddate) {
      this.end = data.enddate;
    }
    if (data.robot) {
      this.selectedRobot = data.robot;
    }
    this.getDhbsl();
  }
}
