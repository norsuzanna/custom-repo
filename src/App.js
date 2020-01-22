import React, { useState } from "react";
import "./App.css";
import { Divider, Input, Typography, List, Skeleton, Badge, Icon } from "antd";
import axios from "axios";
import moment from "moment";

const { Search } = Input;
const { Title, Text } = Typography;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState([]);
  const [isFiltered, setfilter] = useState(false);
  const [message, setMessage] = useState("");

  const searchProject = value => {
    setfilter(true);
    setLoading(true);
    setMessage("Loading...");

    axios
      .get(
        "https://api.github.com/search/repositories?per_page=${per_page}&q=" +
          value
      )
      .then(res => {
        if (res.data.items.length === 0) {
          setfilter(false);
          setMessage("No result found");
        }

        setProject([...res.data.items]);
        setLoading(false);
      });
  };

  const handleOnChange = event => {
    if (event.target.value === "") {
      setProject([]);
      setMessage("");
      setfilter(false);
    }
  };

  return (
    <div className="App">
      <Divider orientation="left">
        <Title level={3}>Github Search</Title>
      </Divider>
      <div className="App-content">
        <Search
          placeholder="Enter project name"
          onSearch={searchProject}
          onChange={handleOnChange}
          className="App-search"
        />
        <Title level={4}>
          {loading
            ? message
            : project.length > 0
            ? project.length + " repository results"
            : message}
        </Title>
        {isFiltered && (
          <List
            loading={loading}
            pagination={{
              pageSize: 10
            }}
            itemLayout="vertical"
            dataSource={project}
            renderItem={item => (
              <List.Item
                extra={
                  <div className="App-extra">
                    <Badge
                      className="App-extra-div"
                      status="default"
                      text={item.language}
                    />
                    <div className="App-extra-div">
                      <Icon
                        type="star"
                        theme="filled"
                        className="App-extra-icon"
                      />
                      <Text>{item.forks}</Text>
                    </div>
                  </div>
                }
              >
                <Skeleton avatar title={false} loading={loading} active>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.full_name}</a>}
                    description={item.description}
                  />
                  <Text disabled>
                    Updated on{" "}
                    {moment(item.updated_at).format("ddd MMM DD YYYY")}
                  </Text>
                </Skeleton>
              </List.Item>
            )}
          />
        )}
      </div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
};

export default App;
