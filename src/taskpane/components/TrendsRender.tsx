import * as React from "react";
import {
  Overlay,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
  Dialog,
  PrimaryButton,
  DialogFooter
} from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import { populateTrends } from "../sheets/population";
import { loadConfig, addTrendsConfig, removeTrendsConfig } from "../sheets/config";

export interface TrendsState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  showRefreshButton: boolean;
  isSuccessHome: boolean;
  isErrorHome: boolean;
  emptyTrendsSearch: boolean;
  showTrendsSearch: boolean;
  showTrendsRows: boolean;
  showTrendsResults: boolean;
  googleTrendsName: string;
  trendsRows: any;
  showTrendsSetUp: boolean;
  noWorkbook: boolean;
}

export default class TrendsRender extends React.Component<any, TrendsState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      showRefreshButton: false,
      isSuccessHome: false,
      isErrorHome: false,
      emptyTrendsSearch: false,
      showTrendsSearch: false,
      showTrendsRows: false,
      showTrendsResults: false,
      googleTrendsName: "",
      trendsRows: [],
      showTrendsSetUp: false,
      noWorkbook: false
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
      onDismiss={() => this.setState({ isSuccess: false, isSuccessHome: false })}
      dismissButtonAriaLabel="Close"
    >
      Success
    </MessageBar>
  );

  ErrorNotify = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isError: false, isErrorHome: false })}
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

  _showTrendsSearch = async bool => {
    this.setState({
      showTrendsRows: false,
      showTrendsSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showTrendsRows = async bool => {
    this.setState({
      showTrendsSearch: false,
      isSuccess: false,
      isError: false,
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

  _showTrendsResults = async (bool, val) => {
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      emptyTrendsSearch: false,
      showTrendsSearch: false,
      showTrendsSetUp: false,
      showTrendsResults: bool,
      googleTrendsName: val
    });
    if (val.trim() == "") {
      this.setState({
        emptyTrendsSearch: true,
        isError: true,
        isSuccess: false,
        showTrendsSetUp: true,
        showTrendsResults: false,
        isLoading: false,
        showTrendsSearch: true
      });
    } else {
      addTrendsConfig({ keyword: val, weeks: 52 });
      this.setState({
        emptyTrendsSearch: false,
        isError: false,
        isSuccess: true,
        showTrendsSetUp: true,
        showTrendsSearch: true,
        isLoading: false
      });
    }
  };

  //side pannel main data, images etc
  render() {
    const stackTokens: Partial<IStackTokens> = { childrenGap: 20, maxWidth: 250 };
    const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 250 } };
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

    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };

    const agendaCardSectionTokens: ICardSectionTokens = { childrenGap: 0 };

    return (
      <div>
        {/* Companies House NZ */}
        <DefaultButton
          className="apiButton"
          text="Google Trends"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => this.setState({ showTrendsSetUp: true })}
        />
        <br />
        <Dialog
          hidden={!this.state.showTrendsSetUp}
          onDismiss={() =>
            this.setState({
              showTrendsSetUp: false,
              isSuccess: false,
              isError: false
            })
          }
          modalProps={{
            onDismissed: () => {
              if (!this.state.isLoading) {
                this.setState({
                  showTrendsSetUp: false,
                  isSuccess: false,
                  isError: false
                });
              }
            }
          }}
        >
          {!this.state.showTrendsSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showTrendsSearch && this.state.isError && <this.ErrorNotify />}
          {this.state.noWorkbook && <this.ErrorNotifyNoWorkbook />}
          <div className={"centerText"}>
            <Text className={"setUpHeaders"}>Google Trends</Text>
          </div>
          <br />
          <div className={"center"}>
            <Stack tokens={stackTokens}>
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
                onClick={() =>
                  this.setState({
                    showTrendsSearch: true,
                    emptyTrendsSearch: false,
                    isSuccess: false,
                    isError: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import Google Trends"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true, showTrendsSetUp: false });
                    let config = await loadConfig();

                    if (config.trends === undefined || config.trends.length == 0) {
                      this.setState({ isError: true, isSuccess: false, isLoading: false, showTrendsSetUp: true });
                    } else {
                      await populateTrends();
                      this.setState({ isLoading: false, isSuccess: true, showTrendsSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, noWorkbook: true, showTrendsSetUp: true });
                  }
                }}
              />
            </Stack>
          </div>
          <Dialog
            hidden={!this.state.showTrendsRows}
            onDismiss={() =>
              this.setState({
                showTrendsRows: false,
                isError: false,
                isSuccess: false
              })
            }
          >
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Current set-up</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
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
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showTrendsRows: false,
                    isSuccess: false,
                    isError: false
                  })
                }
                text="Back"
              />
            </DialogFooter>
          </Dialog>

          <Dialog
            hidden={!this.state.showTrendsSearch}
            onDismiss={() =>
              this.setState({
                showTrendsSearch: false,
                isError: false,
                isSuccess: false
              })
            }
            modalProps={{
              onDismissed: () => {
                if (!this.state.isLoading) {
                  this.setState({
                    showTrendsResults: false,
                    isError: false,
                    isSuccess: false
                  });
                }
              }
            }}
          >
            {this.state.isSuccess && <this.SuccessNotify />}
            {this.state.isError && <this.ErrorNotify />}
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Enter a keyword for Google Trends</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              <SearchBox
                styles={searchBoxStyles}
                placeholder="Keyword"
                onSearch={this._showTrendsResults.bind(null, true)}
              />
            </Stack>
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showTrendsSearch: false,
                    isError: false,
                    isSuccess: false
                  })
                }
                text="Back"
              />
            </DialogFooter>
          </Dialog>
          <DialogFooter className={"center"}>
            <PrimaryButton
              onClick={() =>
                this.setState({
                  showTrendsSetUp: false,
                  isError: false,
                  isSuccess: false
                })
              }
              text="Close"
            />
          </DialogFooter>
        </Dialog>
        {/* <this.LoadingOverlay /> */}
      </div>
    );
  }
}
