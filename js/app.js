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
    var titles = [];
    var body = [];
    this.state.data.forEach(item => {
      titles.push(<h3 className="blogs">{item.title[0].value}</h3>),
      body.push(<div className="blogs">{item.body[0].value}</div>);
    });
    return (
      <div className="container">
        <div className="row">
          <h1 className="title">Blogs:</h1>
          {titles}
          {body}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App source="http://dev-tufts-interactive-design.pantheonsite.io/api/blogs?_format=json" />,
  document.getElementById('container')
);