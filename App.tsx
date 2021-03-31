import * as React from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from "react-native-responsive-screen";
import { FloatingAction } from "react-native-floating-action";
import { ReactNativeModal } from "react-native-modal";
import Axios from "axios";

enum InputType {
  START_DATE = "Start Date",
  END_DATE = "End Date",
  TASKS = "Tasks"
}

interface State {
  data: any[],
  isModalVisible: boolean,
  start_date: string,
  end_date: string,
  tasks: string
}

interface Props {}

class App extends React.Component<Props, State> {

  private actions;
  private start_date;
  private end_date;
  private tasks;
  private endDateInputRef;
  private taskInputRef;
  private fetchData;
  private arrFetchData;

  constructor(props) {
    super(props);

    this.arrFetchData = [];

    Axios.get(
      "https://rockm-23ef8-default-rtdb.firebaseio.com/.json",
      {
        headers: {
          "content-type": "application/json"
        }
      }
    ).then((response) => {
      this.fetchData = response.data;
      for (let key in this.fetchData) {
        this.arrFetchData.push(this.fetchData[key]);
      }
      console.log(this.arrFetchData);
    }).catch(err => {

    });

    this.state = {
      data: [],
      isModalVisible: false
    }

    this.actions = [
      {
        name: "AddTask",
        text: "Add Task",
        position: 1
      },
      {
        name: "Refresh",
        text: "refresh",
        position: 2
      }
    ]
  }

  updateTextInput(value, type) {
    switch (type) {
      case InputType.START_DATE:
        this.setState({start_date: value})
        break;
      case InputType.END_DATE:
        this.setState({end_date: value})
        break;
      case InputType.TASKS:
        this.setState({tasks: value})
        break;
    }
  }

  updateTask() {
    const newTask = {
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      tasks: this.state.tasks
    }
    this.setState({data: [...this.state.data, newTask], isModalVisible: false});
    Axios.post(
      "https://rockm-23ef8-default-rtdb.firebaseio.com/.json",
      newTask,
      {
        headers: {
          "content-type": "application/json"
        }
      }
    ).then((response => {
      this.setState({start_date: "", end_date: "", tasks: ""})
    })).catch(err => {
      this.setState({start_date: "", end_date: "", tasks: ""})
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.viewStyle}>
          <Text style={styles.textStyle}>RockM</Text>
        </View>
        <FlatList
          extraData={this.state}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={data => {
            return (
              <View style={styles.flatListViewStyle}>
                <Text style={styles.indexStyle}>{data.index + 1}</Text>
                <Text style={styles.headerStyle}>START DATE :</Text>
                <Text style={styles.entryTextStyle}>{data.item.start_date}</Text>
                <Text style={styles.headerStyle}>END DATE :</Text>
                <Text style={styles.entryTextStyle}>{data.item.end_date}</Text>
                <Text style={styles.headerStyle}>TASKS :</Text>
                <Text style={styles.entryTextStyle}>{data.item.tasks}</Text>
              </View>
            )
          }}
        />
        <FloatingAction
          actions={this.actions}
          onPressItem={name => {
            if (name === "AddTask")
              this.setState({isModalVisible: true})
            else
              this.setState({data: this.arrFetchData})
          }}
        />
        <ReactNativeModal
          isVisible={this.state.isModalVisible}
          onDismiss={() => this.setState({isModalVisible: false})}
          onBackButtonPress={() => this.setState({isModalVisible: false})}
          style={{backgroundColor: "white"}}
        >
          <ScrollView contentContainerStyle={styles.modalViewStyle}>
            <TextInput
              returnKeyType={"next"}
              placeholder={"Starting Date"}
              value={this.state.start_date}
              onChangeText={(val) => this.updateTextInput(val, InputType.START_DATE)}
              style={styles.firstTextInputStyle}
              onSubmitEditing={() => this.endDateInputRef.focus()}
            />
            <TextInput
              returnKeyType={"next"}
              placeholder={"Ending Date"}
              value={this.state.end_date}
              onChangeText={(val) => this.updateTextInput(val, InputType.END_DATE)}
              style={styles.textInputStyle}
              ref={ref => this.endDateInputRef = ref}
              onSubmitEditing={() => this.taskInputRef.focus()}
            />
            <TextInput
              placeholder={"Tasks"}
              value={this.state.tasks}
              onChangeText={(val) => this.updateTextInput(val, InputType.TASKS)}
              style={styles.taskInputStyle}
              multiline={true}
              ref={ref => this.taskInputRef = ref}
              onSubmitEditing={() => this.updateTask()}
            />
            <TouchableOpacity
              onPress={() => this.updateTask()}
              style={styles.buttonStyle}
            >
              <Text style={styles.buttonTextStyle}>ADD</Text>
            </TouchableOpacity>
          </ScrollView>
        </ReactNativeModal>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 1,
    alignItems: "center"
  },
  viewStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: hp("9%"),
    width: wp("100%"),
    backgroundColor: "blue"
  },
  textStyle: {
    color: "white",
    fontSize: hp("5%")
  },
  headerStyle: {
    fontWeight: "bold",
    fontSize: hp("4%")
  },
  flatListViewStyle: {
    width: wp("100%"),
    marginBottom: hp("5%"),
    marginLeft: wp("2%")
  },
  entryTextStyle: {
    fontSize: hp("3%")
  },
  indexStyle: {
    fontWeight: "bold",
    fontSize: hp("6%")
  },
  textInputStyle: {
    borderWidth: 1,
    width: wp("80%"),
    marginBottom: hp("2%"),
    height: hp("10%"),
    fontSize: hp("4%"),
    borderRadius: hp("1%")
  },
  modalViewStyle: {
    alignItems: "center"
  },
  taskInputStyle: {
    height: hp("40%"),
    borderWidth: 1,
    width: wp("80%"),
    marginBottom: hp("2%"),
    textAlignVertical: "top",
    fontSize: hp("3%"),
    borderRadius: hp("1%")
  },
  buttonStyle: {
    backgroundColor: "blue",
    height: hp("7%"),
    alignItems: "center",
    justifyContent: "center",
    width: wp("60%"),
    borderRadius: hp("4%")
  },
  buttonTextStyle: {
    color: "white",
    fontSize: hp("4%")
  },
  firstTextInputStyle: {
    borderWidth: 1,
    width: wp("80%"),
    marginBottom: hp("2%"),
    height: hp("10%"),
    fontSize: hp("4%"),
    borderRadius: hp("1%"),
    marginTop: hp("7%")
  }
});

export default App;
