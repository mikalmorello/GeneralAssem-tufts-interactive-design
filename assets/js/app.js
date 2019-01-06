class App extends React.Component {
  constructor(){
    super();
    // Set up initial state
    this.state = {
      data: []
    }
  }

  // after a component is rendered for the first time call the component
  componentDidMount(){
    var th = this;
    this.serverRequest = axios.get(this.props.source)
      .then(function(blog){
        th.setState({
          data: blog.data
        });
      })
  }

  // Call the component
  componentWillUnmount(){
    this.serverRequest.abort();
  }

  render() {
    var projects = [];
    this.state.data.forEach(item => {
      
      projects.push(
        <div id={item.nid[0].value} key={item.nid[0].value}>
          <div>TITLE: <br />{item.title[0].value}</div>
        </div>
      )
    });
    return (
      <div className="container">
        <div className="row">
          <h1 className="title">Projects:</h1>
          {projects}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App source="http://dev-tufts-interactive-design.pantheonsite.io/api/projects?_format=json" />,
  document.getElementById('container')
);