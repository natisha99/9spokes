import * as React from "react";
import { Button, ButtonType } from "office-ui-fabric-react";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';
import Title from "./Title";
import Progress from "./Progress";
import {
  populateHouse,
  populateLinkedIn,
  populateFinance,
  populateTrends,
  /*
    populateFacebook,
    populateXero
  */
} from "../sheets/population";
import {
  searchCompany,
} from "../sheets/api";

//import { SourceMapDevToolPlugin } from "webpack";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  listItems: HeroListItem[];
  showSearchResults: boolean;
  companyName: string;
  companyList: [string, number][];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
      showSearchResults: false,
      companyName: "",
      companyList: null
    };
  }

  _showSearchResults = (bool, val) => {
    this.setState({
      showSearchResults: bool,
      companyName: val,
    });

    this.search(val);
  }

  search = query => {
    const url = `https://projectapi.co.nz/api/nzcompaniesoffice/search/?keyword=${query.replace(" ", "+")}`;

    fetch(url)
      .then(results => results.json())
      .then(data => {
        this.setState({ companyList: data.results });

      });
  };

  componentDidMount() {
    this.search("");
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
        var templateFile = await (await fetch("/prototype.xlsm")).blob();
        var reader = new FileReader();
        reader.onload = function (_event) {
          Excel.run(function (context) {
            // strip off the metadata before the base64-encoded string
            var startIndex = reader.result.toString().indexOf("base64,");
            var workbookContents = reader.result.toString().substr(startIndex + 7);
            Excel.createWorkbook(workbookContents);
            return context.sync();
          }).catch(error => {
            console.error(error);
          });
        };

        // read in the file as a data URL so we can parse the base64-encoded string
        reader.readAsDataURL(templateFile);

        return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  };

  //side pannel main data, images etc
  render() {
    const { title, isOfficeInitialized } = this.props;
    const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    //Creates a menu bar on the top (Home, import, help), I've just added those for now, can change later.
    //This helps to separate the task pane into separate pages so the functionality isn't squashed into one place
    return (
      <div className="ms-welcome">
        <Pivot>
          <PivotItem headerText="Home">
            <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
            <Title message="Create a new worksheet to get started">
              <Button
                className="ms-welcome__action"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this.loadTemplate}
              >
                Create workbook from template
              </Button>
            </Title>
          </PivotItem>
          <PivotItem headerText="Set-up">
            <Title message="Search by company name">
              <Stack tokens={stackTokens}>
                <SearchBox
                  placeholder="Company Name"
                  onSearch={this._showSearchResults.bind(null, true)}
                  onEscape={this._showSearchResults.bind(null, false)}
                  onClear={this._showSearchResults.bind(null, false)}
                  onChange={this._showSearchResults.bind(null, false)}
                />
                <br />
                {this.state.showSearchResults && "Search results for: " + this.state.companyName && this.state.companyList}
              </Stack>
            </Title>
          </PivotItem>
          <PivotItem headerText="Import">
            <Title message="Import data from...">
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateHouse();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Companies House
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateTrends();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Google Trends
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateFinance();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Yahoo Finance
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateLinkedIn();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                LinkedIn
              </Button>
              <br />
              {/*
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateXero();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Xero
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateFacebook();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Facebook
              </Button>
              */}
            </Title>
          </PivotItem>
          <PivotItem headerText="Help">
            <HeroList
              message="Discover what Office Add-ins can do for you today!"
              items={this.state.listItems}
            ></HeroList>
          </PivotItem>
        </Pivot>
      </div>
    );
  }
}
