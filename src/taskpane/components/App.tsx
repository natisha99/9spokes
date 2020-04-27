import * as React from "react";
import { Button, ButtonType } from "office-ui-fabric-react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";
import { populateTable } from "../sheets/house";
//import { SourceMapDevToolPlugin } from "webpack";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: []
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        {
          icon: "Ribbon",
          primaryText: "Achieve more with Office integration"
        },
        {
          icon: "Unlock",
          primaryText: "Unlock features and functionality"
        },
        {
          icon: "Design",
          primaryText: "Create and visualize like a pro"
        }
      ]
    });
  }

  /**
   * Creates a new workbook using the template file prototype.xlsm
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function (context) {
      var templateFile = await (await fetch('/prototype.xlsm')).blob();
      var reader = new FileReader();
      reader.onload = (function (_event) {
        Excel.run(function (context) {
          // strip off the metadata before the base64-encoded string
          var startIndex = reader.result.toString().indexOf("base64,");
          var workbookContents = reader.result.toString().substr(startIndex + 7);
          Excel.createWorkbook(workbookContents);
          return context.sync();
        }).catch((error) => {console.error(error)});
      });

      // read in the file as a data URL so we can parse the base64-encoded string
      reader.readAsDataURL(templateFile);
      
      return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  }
    
  click = async () => {
    try {
      populateTable();
      
    } catch (error) {
      console.error(error);
    }
  };

  //side pannel main data, images etc
  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
        <HeroList message="Discover what Office Add-ins can do for you today!" items={this.state.listItems}>
          <p className="ms-font-l">Create a new worksheet</p>
          <Button
            className="ms-welcome__action"
            buttonType={ButtonType.hero}
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.loadTemplate}
          >
            Create workbook from template
          </Button>
          <br/>
          <Button
            className="ms-welcome__action"
            buttonType={ButtonType.hero}
            iconProps={{ iconName: "ChevronRight" }}
            onClick={this.click}
          >
            Import companies house data
          </Button>
        </HeroList>
      </div>
    );
  }

}
