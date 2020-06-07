import * as React from "react";
import { MessageBar, MessageBarType, Dialog, PrimaryButton, DialogFooter } from "office-ui-fabric-react";
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
  isDuplicate: boolean;
  showRefreshButton: boolean;
  emptyTrendsSearch: boolean;
  showTrendsSearch: boolean;
  showTrendsRows: boolean;
  showTrendsResults: boolean;
  googleTrendsName: string;
  trendsRows: any;
  showTrendsSetUp: boolean;
}

export default class TrendsRender extends React.Component<any, TrendsState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      showRefreshButton: false,
      emptyTrendsSearch: false,
      showTrendsSearch: false,
      showTrendsRows: false,
      showTrendsResults: false,
      googleTrendsName: "",
      trendsRows: [],
      showTrendsSetUp: false
    };
  }

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

  ErrorNotifyDuplicate = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isDuplicate: false })}
      dismissButtonAriaLabel="Close"
    >
      Item Already Exists
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
    try {
      this.props.isLoading(true);
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
        this.props.isLoading(false);
        this.setState({
          emptyTrendsSearch: true,
          isError: true,
          isSuccess: false,
          isDuplicate: false,
          showTrendsSetUp: true,
          showTrendsResults: false,
          isLoading: false,
          showTrendsSearch: true
        });
      } else {
        let currentConfig = [];
        let config = await loadConfig();
        config.trends.forEach(item => {
          currentConfig.push(item.keyword.toLowerCase());
        });

        if (currentConfig.some(x => x === val.toLowerCase())) {
          this.setState({
            emptyTrendsSearch: false,
            isError: false,
            isDuplicate: true,
            isSuccess: false,
            showTrendsSetUp: true,
            showTrendsSearch: true,
            isLoading: false
          });
          this.props.isLoading(false);
        } else {
          this.setState({
            emptyTrendsSearch: false,
            isError: false,
            isDuplicate: false,
            isSuccess: true,
            showTrendsSetUp: true,
            showTrendsSearch: true,
            isLoading: false
          });
          addTrendsConfig({ keyword: val, weeks: 52 });
          this.props.isLoading(false);
        }
      }
    } catch (error) {
      this.props.isLoading(false);
      console.error(error);
      this.setState({
        isSuccess: false,
        isError: true,
        isDuplicate: false,
        showTrendsSetUp: true,
        showTrendsSearch: true
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
        {/* Google Trends */}
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
                    isError: false,
                    isDuplicate: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import Google Trends"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.props.isLoading(true);
                    this.setState({ isLoading: true, showTrendsSetUp: false });
                    let config = await loadConfig();

                    if (config.trends === undefined || config.trends.length == 0) {
                      this.props.isLoading(false);
                      this.setState({
                        isError: true,
                        isDuplicate: false,
                        isSuccess: false,
                        isLoading: false,
                        showTrendsSetUp: true
                      });
                    } else {
                      await populateTrends();
                      this.props.isLoading(false);
                      this.setState({ isLoading: false, isSuccess: true, showTrendsSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.props.isLoading(false);
                    this.setState({ isLoading: false, isDuplicate: false, isError: true, showTrendsSetUp: true });
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
                isSuccess: false,
                isDuplicate: false
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
                    isError: false,
                    isDuplicate: false
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
                isSuccess: false,
                isDuplicate: false
              })
            }
            modalProps={{
              onDismissed: () => {
                if (!this.state.isLoading) {
                  this.setState({
                    showTrendsResults: false,
                    isError: false,
                    isSuccess: false,
                    isDuplicate: false
                  });
                }
              }
            }}
          >
            {this.state.isSuccess && <this.SuccessNotify />}
            {this.state.isError && <this.ErrorNotify />}
            {this.state.isDuplicate && <this.ErrorNotifyDuplicate />}
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
                    isSuccess: false,
                    isDuplicate: false
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
                  isSuccess: false,
                  isDuplicate: false
                })
              }
              text="Close"
            />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }
}
