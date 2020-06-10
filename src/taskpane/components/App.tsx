/**
 * @fileoverview controls the UI of the addin.
 * @package
 * @class AppProps
 * @class AppState
 * @class App
 */

//#region import
import * as React from "react";
import { Overlay, Spinner, SpinnerSize, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Title from "./Title";
import Progress from "./Progress";
import {
  populateHouseNZ,
  populateHouseUK,
  populateLinkedIn,
  populateFinance,
  populateTrends
} from "../sheets/population";
import { loadConfig } from "../sheets/config";
import HouseNZRender from "./HouseNZRender";
import HouseUKRender from "./HouseUKRender";
import FinanceRender from "./FinanceRender";
import TrendsRender from "./TrendsRender";
import LinkedInRender from "./LinkedInRender";

export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

//Exporting current states
export interface AppState {
  isLoading: boolean;
  showRefreshButton: boolean;
  isSuccessHome: boolean;
  isErrorHome: boolean;
  noWorkbook: boolean;
  listItems: HeroListItem[];
}

//The main code
export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    //the constructor for the task plane
    super(props, context);
    this.isLoading = this.isLoading.bind(this);
    this.state = {
      isLoading: false,
      showRefreshButton: false,
      isSuccessHome: false,
      isErrorHome: false,
      noWorkbook: false,
      listItems: []
    };
  }

  LoadingOverlay = () => (
    <Overlay isDarkThemed={true} hidden={!this.state.isLoading}>
      <div className="center vertical">
        <Spinner size={SpinnerSize.large} />
      </div>
    </Overlay>
  );

  SuccessNotifyHome = () => (
    <MessageBar
      messageBarType={MessageBarType.success}
      isMultiline={false}
      onDismiss={() => this.setState({ isSuccessHome: false })}
      dismissButtonAriaLabel="Close"
    >
      Success
    </MessageBar>
  );

  ErrorNotifyHome = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isErrorHome: false })}
      dismissButtonAriaLabel="Close"
    >
      Error
    </MessageBar>
  );

  ErrorNotifyNoWorkbook = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ noWorkbook: false })}
      dismissButtonAriaLabel="Close"
    >
      Error: Please create a new workbook
    </MessageBar>
  );

  componentDidMount() {
    this.setState({
      listItems: [
        {
          primaryText: '1. Click "Create workbook from template" in the Home tab.'
        },
        {
          primaryText:
            "2. Select a data source and search for a company in the Set-up tab, then select the appropriate one from the results."
        },
        {
          primaryText:
            '3. Click on "Show current set-up" in the Set-up tab to view and/or ammend your current configurations.'
        },
        {
          primaryText:
            '4. Import the data separately through the Set-up tab, or click "Refresh data" in the Home tab to populate all data at once.'
        }
      ]
    });
  }

  showRefresh = async () => {
    let config = await loadConfig();

    if (
      (config.houseNZ === undefined || config.houseNZ.length == 0) &&
      (config.houseUK === undefined || config.houseUK.length == 0) &&
      (config.finance === undefined || config.finance.length == 0) &&
      (config.trends === undefined || config.trends.length == 0) &&
      (config.linkedin === undefined || config.linkedin.length == 0)
    ) {
      this.setState({ showRefreshButton: false });
    } else {
      this.setState({ showRefreshButton: true });
    }
  };

  /**
   * Creates a new workbook using the template file template.xlsx
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function(context) {
        var templateFile = await (await fetch("/template.xlsx")).blob();
        var reader = new FileReader();
        reader.onload = function(_event) {
          Excel.run(function(context) {
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

  isLoading(bool: boolean) {
    this.setState({
      isLoading: bool
    });
  }

  //side pannel main data, images etc
  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    /*HTML taskplane
      this includes 
        Home, Set-up, and Help tabs
        All UI elements and components 
        Function and object storage calls and references
    */
    return (
      <div className="ms-welcome">
        {this.state.isSuccessHome && <this.SuccessNotifyHome />}
        {this.state.isErrorHome && <this.ErrorNotifyHome />}
        {this.state.noWorkbook && <this.ErrorNotifyNoWorkbook />}
        <Pivot>
          {/* Home Tab*/}
          <PivotItem headerText="Home">
            <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
            <Title message="Create a new workbook to get started">
              <DefaultButton
                className="homePageButtons"
                text="Create workbook from template"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this.loadTemplate}
              />
              <br />
              <DefaultButton
                className="homePageButtons"
                text="Refresh data"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    let config = await loadConfig();

                    if (
                      (config.houseNZ === undefined || config.houseNZ.length == 0) &&
                      (config.houseUK === undefined || config.houseUK.length == 0) &&
                      (config.finance === undefined || config.finance.length == 0) &&
                      (config.trends === undefined || config.trends.length == 0) &&
                      (config.linkedin === undefined || config.linkedin.length == 0)
                    ) {
                      this.setState({ isErrorHome: true, isSuccessHome: false, isLoading: false });
                    } else {
                      await populateHouseNZ();
                      await populateHouseUK();
                      await populateLinkedIn();
                      await populateFinance();
                      await populateTrends();
                      this.setState({ isSuccessHome: true, isErrorHome: false, isLoading: false });
                    }
                  } catch (error) {
                    console.error(error);
                    this.setState({ isErrorHome: true, isSuccessHome: false, isLoading: false });
                  }
                }}
              />
            </Title>
          </PivotItem>

          {/* Set-up Tab*/}
          <PivotItem headerText="Set-up">
            <Title message="Manage Your Data">
              <div className={"centerText"}>
                Choose a source and view/modify your current set-up and add more data to be imported!
              </div>
              <br />

              {/* Companies Office NZ */}
              <HouseNZRender isLoading={this.isLoading} />
              <br />

              {/* Companies House UK */}
              <HouseUKRender isLoading={this.isLoading} />
              <br />

              {/* LinkedIn */}
              <LinkedInRender isLoading={this.isLoading} />
              <br />

              {/* Yahoo Finance */}
              <FinanceRender isLoading={this.isLoading} />
              <br />

              {/* Google Trends */}
              <TrendsRender isLoading={this.isLoading} />
            </Title>
          </PivotItem>

          {/* Help Tab*/}
          <PivotItem headerText="Help">
            <HeroList message="Follow the steps below to get started!" items={this.state.listItems}></HeroList>
          </PivotItem>
        </Pivot>
        <this.LoadingOverlay />
      </div>
    );
  }
}
