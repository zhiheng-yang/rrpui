import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConcreteCount} from '../../../core/entity/entity';
import {ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {HntflService} from '../service/hntfl.service';
import {QuerylistService} from "../../../helpcenter/querylist/querylist.service";

@Component({
  selector: 'app-hntfl',
  templateUrl: './hntfl.component.html',
  styleUrls: ['./hntfl.component.css']
})
export class HntflComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  begin: Date;
  // tslint:disable-next-line:variable-name
  end: Date;
  dateFormat = 'yyyy/MM/dd';
  concreteCounts: ConcreteCount[];
  isCollapse = false;
  selectedCompany;
  CompanyData;
  selectedRobot;
  RobotData;
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private querylistService: QuerylistService,
    private hntflService: HntflService
  ) {
  }

  ngOnInit() {
    this.getHntfl();
    this.getCompany();
  }

  getHntfl(): void {
    // tslint:disable-next-line:variable-name
    let date_begin = '1020-04-13';
    // tslint:disable-next-line:variable-name
    let date_end = '3020-04-20';
    if (this.begin !== undefined) {
      // tslint:disable-next-line:variable-name
      date_begin = this.datePipe.transform(this.begin, 'yyyy-MM-dd');
      // tslint:disable-next-line:variable-name
      date_end = this.datePipe.transform(this.end, 'yyyy-MM-dd');
    }
    this.hntflService.getConcreteCounts(date_begin, date_end, this.selectedRobot === undefined ? null : this.selectedRobot.id)
      .subscribe((res: any) => {
        this.concreteCounts = res.data;
        const countNum = [];
        const time = [];
        for (const concreteCount of this.concreteCounts) {
          countNum.push(concreteCount.count);
          // tslint:disable-next-line:variable-name
          const time_str = this.datePipe.transform(concreteCount.time, 'yyyy年MM月dd日');
          time.push(time_str);
        }
        // @ts-ignore
        const highCharts = require('highCharts');
        // @ts-ignore
        require('highcharts/modules/exporting')(highCharts);
        // 创建图表
        const colors = ['#e0a23b', '#90BF18', '#F59656' ];
        // const colors = ['#2c2830', '#604c33', '#e0a23b'];
        highCharts.getOptions().colors = highCharts.map(colors, function (color) {
          return {
            radialGradient: { cx: 0, cy: -0.5, r: 2.5 },
            stops: [[0, color], [1, highCharts.Color(color).brighten(-60).get('rgb')]]
          };
        });
        highCharts.chart('container', {
          chart: {
            type: 'areaspline',
            hreshold : null,
            backgroundColor: '#1e2340',
            plotShadow: true,
          },
          title: {
            text: this.selectedRobot === undefined ? '总混凝土方量' : '',
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
              text: this.selectedRobot === undefined ? '总混凝土方量（个）' : '混凝土方量（个）',
              style: {
                color: '#b1b1b1'
              },
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} 个</b></td></tr>',
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
            name: '混凝土方量',
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
    this.getHntfl();
  }
}
