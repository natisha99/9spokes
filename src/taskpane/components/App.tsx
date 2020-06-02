/**
 * @fileoverview controls the UI of the addin.
 * @package
 * @class AppProps
 * @class AppState
 * @class App
 */

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

export interface AppState {
  isLoading: boolean;
  showRefreshButton: boolean;
  isSuccessHome: boolean;
  isErrorHome: boolean;
  noWorkbook: boolean;
  listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
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
      Error: Please add data to be imported
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
          icon: "Home",
          primaryText: 'Click "create workbook from template" in the Home tab.'
        },
        {
          icon: "Design",
          primaryText: "Search for a company in the Set-up tab then select the correct company from the options."
        },
        {
          icon: "Ribbon",
          primaryText: "Import the data, this should display the data in the dashboard."
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
   * Creates a new workbook using the template file prototype.xlsx
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function(context) {
        var templateFile = await (await fetch("/prototype.xlsx")).blob();
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

    return (
      <div className="ms-welcome">
        {this.state.isSuccessHome && <this.SuccessNotifyHome />}
        {this.state.isErrorHome && <this.ErrorNotifyHome />}
        {this.state.noWorkbook && <this.ErrorNotifyNoWorkbook />}
        <Pivot>
          {/* Home */}
          <PivotItem headerText="Home">
            <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome" />
            <Title message="Create a new worksheet to get started">
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
                      await populateFinance();
                      await populateTrends();
                      await populateLinkedIn();
                      this.setState({ isSuccessHome: true, isErrorHome: false, isLoading: false });
                    }
                  } catch (error) {
                    console.error(error);
                    this.setState({ noWorkbook: true, isSuccessHome: false, isLoading: false });
                  }
                }}
              />
            </Title>
          </PivotItem>

          {/* Set-up */}
          <PivotItem headerText="Set-up">
            <Title message="Manage Your Data">
              <div className={"centerText"}>
                Choose a source and view/modify your current set-up and add more data to be imported!
              </div>
              <br />

              {/* Companies House NZ */}
              <HouseNZRender isLoading={this.isLoading} />
              <br />

              {/* Companies House UK */}
              <HouseUKRender />
              <br />

              {/* Google Trends */}
              <TrendsRender />
              <br />

              {/* Yahoo Finance */}
              <FinanceRender />
              <br />

              {/* LinkedIn */}
              <LinkedInRender />
            </Title>
          </PivotItem>

          {/* Help */}
          <PivotItem headerText="Help">
            <HeroList message="Follow the steps below to get started!" items={this.state.listItems}></HeroList>
          </PivotItem>
        </Pivot>
        <this.LoadingOverlay />
      </div>
    );
  }
}
