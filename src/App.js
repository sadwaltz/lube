import React, { Component } from 'react';
import lodash from 'lodash';
import ReactEcharts from 'echarts-for-react';
import './services/http';
import './services/httpConfig'

export  class App extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.handleClick = this.handleClick.bind(this);
    this.updateItem1 = this.updateItem1.bind(this);
    this.updateWeight1 = this.updateWeight1.bind(this);
    this.updateItem2 = this.updateItem2.bind(this);
    this.updateWeight2 = this.updateWeight2.bind(this);
  }
  timeTicket = null;
  count = 51;
  getInitialState = () => ({option: this.getOption(),
                            fresh:'start',
                            item1:'',
                            weight1:'',
                            item2:'',
                            weight2:'',
                            editable:true});

  
  fetchNewDate = () => {
    let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
    let item1 = this.state.item1;
    let weight1 = this.state.weight1;
    let item2 = this.state.item2;
    let weight2 = this.state.weight2;
    const option = lodash.cloneDeep(this.state.option); // immutable
    option.title.text = '测试版：' + new Date().getSeconds();
    global.$.get({
      url:'/api?p1='+item1+'&p2='+item2+'&x='+weight1+'&y='+weight2,
      success(res){
        console.log('success',res);
        if (res.success){
          let data0 = option.series[0].data;
          let data1 = option.series[1].data;
          res.data.forEach(element => {
            console.log(element.buy);
            console.log(element.sell);
            
            //data0.shift();
            //data0.push(Math.round(Math.random() * 1000));
            data0.push(element.buy.y);
            
            //data1.shift();
            data1.push(element.sell.y);
            option.xAxis[0].data.push(new Date().toLocaleTimeString().replace(/^\D*/,''));
          });
          
        }
        else{
          console.log('Data server return fail!')
        } 
      },
      error(error){
        console.log('error',error);
      }
    });
    this.setState({
      option:option,
    });
  };

  componentDidMount() {
    
  };

  componentWillUnmount() {
    
  };
  updateItem1(evt){
    this.setState({
      item1:evt.target.value,
    });
  };
  updateWeight1(evt){
    this.setState({
      weight1:evt.target.value,
    });
  };
  updateItem2(evt){
    this.setState({
      item2:evt.target.value,
    });
  };
  updateWeight2(evt){
    this.setState({
      weight2:evt.target.value,
    });
  };
  //在zoom时保持用户选择不变
  onDataZoomed = (params)  => {
    //var startnum = params.start;
    //console.log("startnum:"+startnum);
    const option = lodash.cloneDeep(this.state.option); // immutable
    option.dataZoom[0].start = params.start;
    option.dataZoom[0].end = params.end;
    this.setState({
      option:option,
    });
  };
  handleClick = () => {
    let freshState = this.state.fresh;
    //const option = lodash.cloneDeep(this.state.option); // immutable
    if (freshState === 'start') {
      clearInterval(this.timeTicket);
      this.timeTicket = setInterval(this.fetchNewDate, 10000);//10秒
      this.setState({
        //option: option,
        fresh:'pause',
        editable:!this.state.editable
      });
    }
    if (this.timeTicket && freshState === 'pause') {
      clearInterval(this.timeTicket);
      this.setState({
        fresh:'start',
        editable:!this.state.editable
      });
    }
    
  };
  getOption = () => ({
    title: {
      text:'测试版：',
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data:['买1价差', '卖1价差']
    },
    toolbox: {
      show: true,
      feature: {
        dataView: {readOnly: false},
        restore: {},
        saveAsImage: {}
      }
    },
    
    dataZoom: {
      show: false,
      start: 0,
      end: 100
    },
    
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        data: []
      }
    ],
    yAxis: [
      
      {
        type: 'value',
        scale: true,
        name: '加权价差',
              
      }
    ],
    dataZoom: [{
      type: 'inside',
      start: 70,
      end: 100
      }, {
      start: 70,
      end: 100,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
    series: [
      {
        name:'买1价差',
        type:'line',
        
        data:[]
      },
      {
        name:'卖1价差',
        type:'line',
        data:[]
      }
    ]
  });

  
  render() {
    let code = "<ReactEcharts ref='echartsInstance' \n" +
          "  option={this.state.option} />\n";
    
    let onEvents = {
      'datazoom': this.onDataZoomed 
    }

    return (
      <div className='examples'>
        <div className='parent'>

          <ReactEcharts ref='echarts_react'
            option={this.state.option}
            style={{height: 400}} 
            onEvents={onEvents}/>
          <div id="controllPanel" style={{margin:'auto',width:600}} >
            <p>
              <label>品种1</label>
              <input id="item1" onChange={this.updateItem1} editable={this.editable}/>
              <label>加权</label>
              <input id="weight1" onChange={this.updateWeight1}/>
            </p>
            <p>
              <label>品种2</label>
              <input id="item2" onChange={this.updateItem2}/>
              <label>加权</label>
              <input id="weight2" onChange={this.updateWeight2}/>
            </p>
            <p>
              <button id="trigger" onClick={this.handleClick}>{this.state.fresh}</button>
            </p>
          </div>
            
        </div>
      </div>
    );
  }
}

export default App;
