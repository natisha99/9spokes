/**
 * @fileoverview controls the UI of the addin.
 * @package
 * @class AppProps
 * @class AppState
 * @class App
 */

import * as React from "react";
import {
  Button,
  ButtonType,
  Overlay,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Dialog,
  IStyleSet
} from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { Pivot, PivotItem, PivotLinkFormat, IPivotStyles } from "office-ui-fabric-react/lib/Pivot";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import Title from "./Title";
import Progress from "./Progress";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import {
  populateHouse,
  populateLinkedIn,
  populateFinance,
  populateTrends
  /*
      populateFacebook,
      populateXero
    */
} from "../sheets/population";
import { searchFinance, searchHouse, searchLinkedin } from "../sheets/api";
import { loadConfig, addHouseConfig, addFinanceConfig, addLinkedinConfig, removeHouseConfig, removeFinanceConfig, removeLinkedinConfig, removeTrendsConfig, addTrendsConfig } from "../sheets/config";

//import { SourceMapDevToolPlugin } from "webpack";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

// const alertClicked = (data: string): void => {
//   console.log(data + " is Clicked");
// };
export interface AppProps {
  title: string;
  isOfficeInitialized: boolean;
}

export interface AppState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  emptyHouseSearch: boolean;
  emptyFinanceSearch: boolean;
  emptyLinkedinSearch: boolean;
  emptyTrendsSearch: boolean;
  listItems: HeroListItem[];
  showHouseSearch: boolean;
  showFinanceSearch: boolean;
  showLinkedinSearch: boolean;
  showTrendsSearch: boolean;
  showHouseRows: boolean;
  showFinanceRows: boolean;
  showLinkedinRows: boolean;
  showTrendsRows: boolean;
  showHouseResults: boolean;
  showTrendsResults: boolean;
  showFinanceResults: boolean;
  showLinkedinResults: boolean;
  companiesHouseName: string;
  googleTrendsName: string;
  yahooFinanceName: string;
  linkedinName: string;
  companiesHouseList: any;
  yahooFinanceList: any;
  linkedInList: any;
  cNum: number;
  houseRows: any;
  yahooRows: any;
  linkedInRows: any;
  trendsRows: any;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      emptyHouseSearch: false,
      emptyFinanceSearch: false,
      emptyLinkedinSearch: false,
      emptyTrendsSearch: false,
      listItems: [],
      showHouseSearch: false,
      showFinanceSearch: false,
      showLinkedinSearch: false,
      showTrendsSearch: false,
      showHouseRows: false,
      showFinanceRows: false,
      showLinkedinRows: false,
      showTrendsRows: false,
      showHouseResults: false,
      showTrendsResults: false,
      showFinanceResults: false,
      showLinkedinResults: false,
      companiesHouseName: "",
      googleTrendsName: "",
      yahooFinanceName: "",
      linkedinName: "",
      companiesHouseList: [],
      yahooFinanceList: [],
      linkedInList: [],
      cNum: null,
      houseRows: [],
      yahooRows: [],
      linkedInRows: [],
      trendsRows: []
    };
  }

  LoadingOverlay = () => (
    <Overlay isDarkThemed={true} hidden={!this.state.isLoading}>
      <div className="center vertical">
        <Spinner size={SpinnerSize.large} />
      </div>
    </Overlay>
  );

  SuccessNotify = () => (
    <MessageBar
      messageBarType={MessageBarType.success}
      isMultiline={false}
      onDismiss={() => this.setState({ isSuccess: false })}
      dismissButtonAriaLabel="Close"
    >
      Success
    </MessageBar>
  );

  ErrorNotify = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isError: false })}
      dismissButtonAriaLabel="Close"
    >
      Error
    </MessageBar>
  );

  _showFinanceSearch = async bool => {
    this.setState({
      showFinanceRows: false,
      showFinanceSearch: bool
    });
  };

  _showLinkedinSearch = async bool => {
    this.setState({
      showLinkedinRows: false,
      showLinkedinSearch: bool
    });
  };

  _showTrendsSearch = async bool => {
    this.setState({
      showTrendsRows: false,
      showTrendsSearch: bool
    });
  };

  _showHouseRows = async bool => {
    this.setState({
      showHouseSearch: false,
      showHouseRows: bool,
      houseRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.house.forEach((item, i) => {
      temp.push([i, item.companyName, item.companyNumber]);
    });
    this.setState({ houseRows: temp });
  };

  _showFinanceRows = async bool => {
    this.setState({
      showFinanceSearch: false,
      showFinanceRows: bool,
      yahooRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.finance.forEach((item, i) => {
      temp.push([i, item.ticker]);
    });
    this.setState({ yahooRows: temp });
  };

  _showLinkedinRows = async bool => {
    this.setState({
      showLinkedinSearch: false,
      showLinkedinRows: bool,
      linkedInRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.linkedin.forEach((item, i) => {
      temp.push([i, item.profileName]);
    });
    this.setState({ linkedInRows: temp });
  };

  _showTrendsRows = async bool => {
    this.setState({
      showTrendsSearch: false,
      showTrendsRows: bool,
      trendsRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.trends.forEach((item, i) => {
      temp.push([i, item.keyword]);
    });
    this.setState({ trendsRows: temp });
  };

  _showHouseResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      emptyHouseSearch: false,
      showHouseSearch: false,
      showHouseResults: bool,
      companiesHouseName: val
    });
    if (val.trim() == "") {
      this.setState({ emptyHouseSearch: true, showHouseResults: false, isLoading: false, showHouseSearch: true });
    } else {
      this.setState({
        emptyHouseSearch: false,
        companiesHouseList: (await searchHouse(val)).results,
        showHouseSearch: true,
        isLoading: false
      });
    }
  };

  _showTrendsResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      emptyTrendsSearch: false,
      showTrendsSearch: false,
      showTrendsResults: bool,
      googleTrendsName: val
    });
    if (val.trim() == "") {
      this.setState({ emptyTrendsSearch: true, showTrendsResults: false, isLoading: false, showTrendsSearch: true });
    } else {
      addTrendsConfig({ keyword: val, weeks: 52});
      this.setState({
        emptyTrendsSearch: false,
        isSuccess: true,
        showTrendsSearch: true,
        isLoading: false
      });
    }
  };

  _showFinanceResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      emptyFinanceSearch: false,
      showFinanceSearch: false,
      showFinanceResults: bool,
      yahooFinanceName: val
    });

    if (val.trim() == "") {
      this.setState({ emptyFinanceSearch: true, showFinanceResults: false, isLoading: false, showFinanceSearch: true });
    } else {
      this.setState({
        emptyFinanceSearch: false,
        yahooFinanceList: (await searchFinance(val)).results,
        showFinanceSearch: true,
        isLoading: false
      });
    }
  };

  _showLinkedinResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      emptyLinkedinSearch: false,
      showLinkedinSearch: false,
      showLinkedinResults: bool,
      linkedinName: val
    });

    if (val.trim() == "") {
      this.setState({ emptyLinkedinSearch: true, showLinkedinResults: false, isLoading: false, showLinkedinSearch: true });
    } else {
      this.setState({ 
        emptyLinkedinSearch: false,
        linkedInList: (await searchLinkedin(val)).results,
        showLinkedinSearch: true,
        isLoading: false
     });
    }
  };

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

  /**
   * Creates a new workbook using the template file prototype.xlsx
   */
  loadTemplate = async () => {
    try {
      Excel.run(async function (context) {
        var templateFile = await (await fetch("/prototype.xlsx")).blob();
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
    const stackTokens: Partial<IStackTokens> = { childrenGap: 20, maxWidth: 250 };
    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 250 }};
    const descriptionTextStyles: ITextStyles = {
      root: {
        color: "#333333",
        fontWeight: FontWeights.semibold
      }
    };

    const footerCardSectionStyles: ICardSectionStyles = {
      root: {
        borderTop: "1px solid #F3F2F1"
      }
    };

    const subduedTextStyles: ITextStyles = {
      root: {
        color: "#666666"
      }
    };

    const sectionStackTokens: IStackTokens = { childrenGap: 30 };
    const horizontalGapStackTokens: IStackTokens = {
      childrenGap: 10,
      padding: 10
    };
    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };

    const agendaCardSectionTokens: ICardSectionTokens = { childrenGap: 0 };

    const pivotStyles: Partial<IStyleSet<IPivotStyles>> = {
      root:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      link: {
        // margin: "center",
        width: "85px"
      },
      linkIsSelected: {
        width: "85px"
      }
    };

    if (!isOfficeInitialized) {
      return (
        <Progress title={title} logo="assets/logo-filled.png" message="Please sideload your addin to see app body." />
      );
    }

    return (
      <div className="ms-welcome">
        {this.state.isSuccess && <this.SuccessNotify />}
        {this.state.isError && <this.ErrorNotify />}
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
            <br />
            <div className="center">
              <Pivot linkFormat={PivotLinkFormat.tabs} styles={pivotStyles}>
                {/* Companies House */}
                <PivotItem headerText="Companies House">
                  <div className={"center"}>
                    <Stack horizontal tokens={horizontalGapStackTokens}>
                      <DefaultButton
                        className="configButton"
                        text="Show current set-up"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={this._showHouseRows.bind(null, true)}
                      />
                      <DefaultButton
                        className="configButton"
                        text="Add another company"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={() => this.setState({ showHouseSearch: true, emptyHouseSearch: false })}
                      />
                    </Stack>
                  </div>
                  <br/>
                  <div className={"center"}>
                    <Stack tokens={stackTokens}>
                      {this.state.showHouseRows &&
                        this.state.houseRows.map(element => (
                          <Card key={element} tokens={cardTokens}>
                            <Card.Section fill verticalAlign="end"></Card.Section>
                            <Card.Section>
                              <Text variant="small" styles={subduedTextStyles}>
                                Companies House NZ
                              </Text>
                              <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                {element[1]}
                              </Text>
                            </Card.Section>
                            <Card.Section tokens={agendaCardSectionTokens}>
                              <Text variant="small" styles={descriptionTextStyles}>
                                {element[2]}
                              </Text>
                            </Card.Section>
                            <Card.Section tokens={agendaCardSectionTokens}>
                              <DefaultButton
                                className="removeButton"
                                onClick={async () => {
                                  try {
                                    removeHouseConfig(element[0]);
                                    let temp = [];
                                    let config = await loadConfig();
                                    config.house.forEach((item, i) => {
                                      temp.push([i, item.companyName, item.companyNumber]);
                                    });
                                    this.setState({ houseRows: temp });
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                                text="Remove"
                              />
                            </Card.Section>
                            <Card.Item grow={1}>
                              <span />
                            </Card.Item>
                            <Card.Section
                              horizontal
                              styles={footerCardSectionStyles}
                              tokens={footerCardSectionTokens}
                            ></Card.Section>
                          </Card>
                        ))}
                    </Stack>
                  </div>
                  <Dialog
                    hidden={!this.state.showHouseSearch}
                    onDismiss={() =>
                      this.setState({
                        showHouseSearch: false
                      })
                    }
                    modalProps={{
                      onDismissed: () => {
                        if (!this.state.isLoading) {
                          this.setState({
                            companiesHouseList: [],
                            showHouseResults: false
                          });
                        }
                      }
                    }}
                  >
                    <Title message="Search within Companies House">
                      <Stack tokens={stackTokens}>
                        <SearchBox
                          styles={searchBoxStyles}
                          placeholder="Company Name"
                          onSearch={this._showHouseResults.bind(null, true)}
                        />
                        <Text className={"emptySearch"}>{this.state.emptyHouseSearch && "Invalid search"}</Text>
                        {this.state.showHouseResults && "Search results for: " + this.state.companiesHouseName}
                        <br />
                        <Stack tokens={sectionStackTokens}>
                          {this.state.showHouseResults &&
                            this.state.companiesHouseList.map(element => (
                              <Card
                                key={element[1]}
                                onClick={async () => {
                                  try {
                                    addHouseConfig({ companyName: element[0], companyNumber: element[1] });
                                    this.setState({
                                      isSuccess: true,
                                      showHouseSearch: false
                                    });
                                  } catch (error) {
                                    console.error(error);
                                    this.setState({
                                      isSuccess: false,
                                      showHouseSearch: false
                                    });
                                  }
                                }}
                                tokens={cardTokens}
                              >
                                <Card.Section fill verticalAlign="end"></Card.Section>
                                <Card.Section>
                                  <Text variant="small" styles={subduedTextStyles}>
                                    Companies House NZ
                                  </Text>
                                  <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                    {element[0]}
                                  </Text>
                                </Card.Section>
                                <Card.Section tokens={agendaCardSectionTokens}>
                                  <Text variant="small" styles={descriptionTextStyles}>
                                    {element[1]}
                                  </Text>
                                </Card.Section>
                                <Card.Item grow={1}>
                                  <span />
                                </Card.Item>
                                <Card.Section
                                  horizontal
                                  styles={footerCardSectionStyles}
                                  tokens={footerCardSectionTokens}
                                ></Card.Section>
                              </Card>
                            ))}
                        </Stack>
                        <br />
                      </Stack>
                    </Title>
                  </Dialog>
                </PivotItem>

                {/* Google Trends */}
                <PivotItem headerText="Google Trends">
                  <div className={"center"}>
                      <Stack horizontal tokens={horizontalGapStackTokens}>
                        <DefaultButton
                          className="configButton"
                          text="Show current set-up"
                          iconProps={{ iconName: "ChevronRight" }}
                          onClick={this._showTrendsRows.bind(null, true)}
                        />
                        <DefaultButton
                          className="configButton"
                          text="Enter a keyword"
                          iconProps={{ iconName: "ChevronRight" }}
                          onClick={() => this.setState({ showTrendsSearch: true, emptyTrendsSearch: false })}
                        />
                      </Stack>
                  </div>
                  <br/>
                  <div className={"center"}>
                    <Stack tokens={sectionStackTokens}>
                      {this.state.showTrendsRows &&
                        this.state.trendsRows.map(element => (
                          <Card key={element} tokens={cardTokens}>
                            <Card.Section fill verticalAlign="end"></Card.Section>
                            <Card.Section>
                              <Text variant="small" styles={subduedTextStyles}>
                                Google Trends
                              </Text>
                              <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                {element[1]}
                              </Text>
                            </Card.Section>
                            <Card.Section tokens={agendaCardSectionTokens}>
                              <DefaultButton
                                className="removeButton"
                                onClick={async () => {
                                  try {
                                    removeTrendsConfig(element[0]);
                                    let temp = [];
                                    let config = await loadConfig();
                                    config.trends.forEach((item, i) => {
                                      temp.push([i, item.keyword]);
                                    });
                                    this.setState({ trendsRows: temp });
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                                text="Remove"
                              />
                            </Card.Section>
                            <Card.Item grow={1}>
                              <span />
                            </Card.Item>
                            <Card.Section
                              horizontal
                              styles={footerCardSectionStyles}
                              tokens={footerCardSectionTokens}
                            ></Card.Section>
                          </Card>
                        ))}
                    </Stack>
                  </div>
                  <Dialog
                    hidden={!this.state.showTrendsSearch}
                    onDismiss={() =>
                      this.setState({
                        showTrendsSearch: false
                      })
                    }
                    modalProps={{
                      onDismissed: () => {
                        if (!this.state.isLoading) {
                          this.setState({
                            showTrendsResults: false
                          });
                        }
                      }
                    }}
                  >
                    <Title message="Enter a keyword for Google Trends">
                      <Stack tokens={stackTokens}>
                        <SearchBox
                          styles={searchBoxStyles}
                          placeholder="Keyword"
                          onSearch={this._showTrendsResults.bind(null, true)}
                        />
                        <Text className={"emptySearch"}>{this.state.emptyTrendsSearch && "Invalid input"}</Text>
                        {this.state.showTrendsResults && "Successfully added keyword: " + this.state.googleTrendsName}
                        <br />
                      </Stack>
                    </Title>
                  </Dialog>
                </PivotItem>

                {/* Yahoo Finance */}
                <PivotItem headerText="Yahoo Finance">
                  <div className={"center"}>
                    <Stack horizontal tokens={horizontalGapStackTokens}>
                      <DefaultButton
                        className="configButton"
                        text="Show current set-up"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={this._showFinanceRows.bind(null, true)}
                      />
                      <DefaultButton
                        className="configButton"
                        text="Add another company"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={() => this.setState({ showFinanceSearch: true, emptyFinanceSearch: false })}
                      />
                    </Stack>
                  </div>
                  <br/>
                  <div className={"center"}>
                    <Stack tokens={sectionStackTokens}>
                      {this.state.showFinanceRows &&
                        this.state.yahooRows.map(element => (
                          <Card key={element} tokens={cardTokens}>
                            <Card.Section fill verticalAlign="end"></Card.Section>
                            <Card.Section>
                              <Text variant="small" styles={subduedTextStyles}>
                                Yahoo Finance
                              </Text>
                              <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                {element[1]}
                              </Text>
                            </Card.Section>
                            <Card.Section tokens={agendaCardSectionTokens}>
                              <DefaultButton
                                className="removeButton"
                                onClick={async () => {
                                  try {
                                    removeFinanceConfig(element[0]);
                                    let temp = [];
                                    let config = await loadConfig();
                                    config.finance.forEach((item, i) => {
                                      temp.push([i, item.ticker]);
                                    });
                                    this.setState({ yahooRows: temp });
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                                text="Remove"
                              />
                            </Card.Section>
                            <Card.Item grow={1}>
                              <span />
                            </Card.Item>
                            <Card.Section
                              horizontal
                              styles={footerCardSectionStyles}
                              tokens={footerCardSectionTokens}
                            ></Card.Section>
                          </Card>
                        ))}
                    </Stack>
                  </div>
                  <Dialog
                    hidden={!this.state.showFinanceSearch}
                    onDismiss={() =>
                      this.setState({
                        showFinanceSearch: false
                      })
                    }
                    modalProps={{
                      onDismissed: () => {
                        if (!this.state.isLoading) {
                          this.setState({
                            yahooFinanceList: [],
                            showFinanceResults: false
                          });
                        }
                      }
                    }}
                  >
                    <Title message="Search within Yahoo Finance">
                      <Stack tokens={stackTokens}>
                        <SearchBox
                          styles={searchBoxStyles}
                          placeholder="Company Name"
                          onSearch={this._showFinanceResults.bind(null, true)}
                        />
                        <Text className={"emptySearch"}>{this.state.emptyFinanceSearch && "Invalid search"}</Text>
                        {this.state.showFinanceResults && "Search results for: " + this.state.yahooFinanceName}
                        <br />
                        <Stack tokens={sectionStackTokens}>
                          {this.state.showFinanceResults &&
                            this.state.yahooFinanceList.map(element => (
                              <Card
                                key={element}
                                aria-label="Clickable vertical card with image bleeding at the top of the card"
                                onClick={async () => {
                                  try {
                                    addFinanceConfig({ ticker: element, interval: "1d", range: "1y" });
                                    this.setState({
                                      isSuccess: true,
                                      showFinanceSearch: false
                                    });
                                  } catch (error) {
                                    console.error(error);
                                    this.setState({
                                      isSuccess: false,
                                      showFinanceSearch: false
                                    });
                                  }
                                }}
                                tokens={cardTokens}
                              >
                                <Card.Section fill verticalAlign="end"></Card.Section>
                                <Card.Section>
                                  <Text variant="small" styles={subduedTextStyles}>
                                    Yahoo Finance
                                  </Text>
                                  <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                    {element}
                                  </Text>
                                </Card.Section>
                                <Card.Item grow={1}>
                                  <span />
                                </Card.Item>
                                <Card.Section
                                  horizontal
                                  styles={footerCardSectionStyles}
                                  tokens={footerCardSectionTokens}
                                ></Card.Section>
                              </Card>
                            ))}
                        </Stack>
                        <br />
                      </Stack>
                    </Title>
                  </Dialog>
                </PivotItem>

                {/* LinkedIn */}
                <PivotItem headerText="LinkedIn">
                  <div className={"center"}>
                    <Stack horizontal tokens={horizontalGapStackTokens}>
                      <DefaultButton
                        className="configButton"
                        text="Show current set-up"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={this._showLinkedinRows.bind(null, true)}
                      />
                      <DefaultButton
                        className="configButton"
                        text="Add another profile"
                        iconProps={{ iconName: "ChevronRight" }}
                        onClick={() => this.setState({ showLinkedinSearch: true, emptyLinkedinSearch: false })}
                      />
                    </Stack>
                  </div>
                  <br/>
                  <div className={"center"}>
                    <Stack tokens={sectionStackTokens}>
                      {this.state.showLinkedinRows &&
                        this.state.linkedInRows.map(element => (
                          <Card key={element} tokens={cardTokens}>
                            <Card.Section fill verticalAlign="end"></Card.Section>
                            <Card.Section>
                              <Text variant="small" styles={subduedTextStyles}>
                                LinkedIn
                              </Text>
                              <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                {element[1]}
                              </Text>
                            </Card.Section>
                            <Card.Section tokens={agendaCardSectionTokens}>
                              <DefaultButton
                                className="removeButton"
                                onClick={async () => {
                                  try {
                                    removeLinkedinConfig(element[0]);
                                    let temp = [];
                                    let config = await loadConfig();
                                    config.linkedin.forEach((item, i) => {
                                      temp.push([i, item.profileName]);
                                    });
                                    this.setState({ linkedInRows: temp });
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                                text="Remove"
                              />
                            </Card.Section>
                            <Card.Item grow={1}>
                              <span />
                            </Card.Item>
                            <Card.Section
                              horizontal
                              styles={footerCardSectionStyles}
                              tokens={footerCardSectionTokens}
                            ></Card.Section>
                          </Card>
                        ))}
                    </Stack>
                  </div>
                  <Dialog
                    hidden={!this.state.showLinkedinSearch}
                    onDismiss={() =>
                      this.setState({
                        showLinkedinSearch: false
                      })
                    }
                    modalProps={{
                      onDismissed: () => {
                        if (!this.state.isLoading) {
                          this.setState({
                            linkedInList: [],
                            showLinkedinResults: false
                          });
                        }
                      }
                    }}
                  >
                    <Title message="Search within LinkedIn">
                      <Stack tokens={stackTokens}>
                        <SearchBox
                          styles={searchBoxStyles}
                          placeholder="Company profile name"
                          onSearch={this._showLinkedinResults.bind(null, true)}
                        />
                        <Text className={"emptySearch"}>{this.state.emptyLinkedinSearch && "Invalid search"}</Text>
                        {this.state.showLinkedinResults && "Search results for: " + this.state.linkedinName}
                        <br />
                        <Stack tokens={sectionStackTokens}>
                          {this.state.showLinkedinResults &&
                            this.state.linkedInList.map(element => (
                              <Card
                                key={element}
                                onClick={async () => {
                                  try {
                                    addLinkedinConfig({ profileName: element });
                                    this.setState({
                                      isSuccess: true,
                                      showLinkedinSearch: false
                                    });
                                  } catch (error) {
                                    console.error(error);
                                    this.setState({
                                      isSuccess: false,
                                      showLinkedinSearch: false
                                    });
                                  }
                                }}
                                tokens={cardTokens}
                              >
                                <Card.Section fill verticalAlign="end"></Card.Section>
                                <Card.Section>
                                  <Text variant="small" styles={subduedTextStyles}>
                                    LinkedIn
                                  </Text>
                                  <Text variant="mediumPlus" styles={descriptionTextStyles}>
                                    {element}
                                  </Text>
                                </Card.Section>
                                <Card.Item grow={1}>
                                  <span />
                                </Card.Item>
                                <Card.Section
                                  horizontal
                                  styles={footerCardSectionStyles}
                                  tokens={footerCardSectionTokens}
                                ></Card.Section>
                              </Card>
                            ))}
                        </Stack>
                        <br />
                      </Stack>
                    </Title>
                  </Dialog>
                </PivotItem>
              </Pivot>
            </div>
          </PivotItem>
                                
          <PivotItem headerText="Import">
            <Title message="Import data from...">
              <DefaultButton
                className="apiButton"
                text="Companies House"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateHouse();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              />
              <br />
              <DefaultButton
                className="apiButton"
                text="Google Trends"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateTrends();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              />
              <br />
              <DefaultButton
                className="apiButton"
                text="Yahoo Finance"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateFinance();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              />
              <br />
              <DefaultButton
                className="apiButton"
                text="LinkedIn"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true });
                    await populateLinkedIn();
                    this.setState({ isLoading: false, isSuccess: true });
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, isError: true });
                  }
                }}
              />
            </Title>
          </PivotItem>
          <PivotItem headerText="Help">
            <HeroList message="Follow the steps below to get started!" items={this.state.listItems}></HeroList>
          </PivotItem>
        </Pivot>
        <this.LoadingOverlay />
      </div>
    );
  }
}
