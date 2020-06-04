import * as React from "react";
import { MessageBar, MessageBarType, Dialog, PrimaryButton, DialogFooter } from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import { populateFinance } from "../sheets/population";
import { searchFinance } from "../sheets/api";
import { loadConfig, removeFinanceConfig, addFinanceConfig } from "../sheets/config";

export interface FinanceState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDuplicate: boolean;
  noResults: boolean;
  showRefreshButton: boolean;
  emptyFinanceSearch: boolean;
  showFinanceSearch: boolean;
  showFinanceRows: boolean;
  showFinanceResults: boolean;
  yahooFinanceName: string;
  yahooFinanceList: any;
  yahooRows: any;
  showFinanceSetUp: boolean;
}

export default class FinanceRender extends React.Component<any, FinanceState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
      showRefreshButton: false,
      emptyFinanceSearch: false,
      showFinanceSearch: false,
      showFinanceRows: false,
      showFinanceResults: false,
      yahooFinanceName: "",
      yahooFinanceList: [],
      yahooRows: [],
      showFinanceSetUp: false
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

  ErrorNotifyNoResults = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ noResults: false })}
      dismissButtonAriaLabel="Close"
    >
      No Results Found
    </MessageBar>
  );

  _showFinanceSearch = async bool => {
    this.setState({
      showFinanceRows: false,
      showFinanceSearch: bool,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false
    });
  };

  _showFinanceRows = async bool => {
    this.setState({
      showFinanceSearch: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
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

  _showFinanceResults = async (bool, val) => {
    this.props.isLoading(true);
    this.setState({
      isLoading: true,
      isError: false,
      isDuplicate: false,
      noResults: false,
      isSuccess: false,
      emptyFinanceSearch: false,
      showFinanceSetUp: false,
      showFinanceSearch: false,
      showFinanceResults: bool,
      yahooFinanceName: val
    });

    if (val.trim() == "") {
      this.props.isLoading(false);
      this.setState({
        emptyFinanceSearch: true,
        isError: true,
        isDuplicate: false,
        noResults: false,
        isSuccess: false,
        showFinanceSetUp: true,
        showFinanceResults: false,
        isLoading: false,
        showFinanceSearch: true
      });
    } else {
      this.setState({
        emptyFinanceSearch: false,
        isError: false,
        isDuplicate: false,
        showFinanceSetUp: true,
        isSuccess: false,
        noResults: false,
        yahooFinanceList: (await searchFinance(val)).results,
        showFinanceSearch: true,
        isLoading: false
      });
      if (this.state.yahooFinanceList == undefined || this.state.yahooFinanceList.length == 0) {
        this.setState({ noResults: true });
      }
      this.props.isLoading(false);
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

    const sectionStackTokens: IStackTokens = { childrenGap: 30 };
    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };

    const agendaCardSectionTokens: ICardSectionTokens = { childrenGap: 0 };

    return (
      <div>
        {/* Yahoo Finance */}
        <DefaultButton
          className="apiButton"
          text="Yahoo Finance"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => this.setState({ showFinanceSetUp: true })}
        />
        <Dialog
          hidden={!this.state.showFinanceSetUp}
          onDismiss={() =>
            this.setState({
              showFinanceSetUp: false,
              isSuccess: false,
              isError: false,
              isDuplicate: false,
              noResults: false
            })
          }
          modalProps={{
            onDismissed: () => {
              if (!this.state.isLoading) {
                this.setState({
                  showFinanceSetUp: false,
                  isSuccess: false,
                  isError: false,
                  isDuplicate: false,
                  noResults: false
                });
              }
            }
          }}
        >
          {!this.state.showFinanceSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showFinanceSearch && this.state.isError && <this.ErrorNotify />}
          <div className={"centerText"}>
            <Text className={"setUpHeaders"}>Yahoo Finance</Text>
          </div>
          <br />
          <div className={"center"}>
            <Stack tokens={stackTokens}>
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
                onClick={() =>
                  this.setState({
                    showFinanceSearch: true,
                    emptyFinanceSearch: false,
                    isSuccess: false,
                    isError: false,
                    isDuplicate: false,
                    noResults: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import Yahoo Finance"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.props.isLoading(true);
                    this.setState({ isLoading: true, showFinanceSetUp: false });
                    let config = await loadConfig();

                    if (config.finance === undefined || config.finance.length == 0) {
                      this.props.isLoading(false);
                      this.setState({
                        isError: true,
                        isDuplicate: false,
                        noResults: false,
                        isSuccess: false,
                        isLoading: false,
                        showFinanceSetUp: true
                      });
                    } else {
                      await populateFinance();
                      this.props.isLoading(false);
                      this.setState({ isLoading: false, isSuccess: true, showFinanceSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.props.isLoading(false);
                    this.setState({
                      isLoading: false,
                      isDuplicate: false,
                      noResults: false,
                      isError: true,
                      showFinanceSetUp: true
                    });
                  }
                }}
              />
            </Stack>
          </div>
          <Dialog
            hidden={!this.state.showFinanceRows}
            onDismiss={() =>
              this.setState({
                showFinanceRows: false,
                isError: false,
                isDuplicate: false,
                isSuccess: false,
                noResults: false
              })
            }
          >
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Current set-up</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
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
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showFinanceRows: false,
                    isError: false,
                    isDuplicate: false,
                    isSuccess: false,
                    noResults: false
                  })
                }
                text="Back"
              />
            </DialogFooter>
          </Dialog>

          <Dialog
            hidden={!this.state.showFinanceSearch}
            onDismiss={() =>
              this.setState({
                showFinanceSearch: false,
                isError: false,
                isDuplicate: false,
                isSuccess: false,
                noResults: false
              })
            }
            modalProps={{
              onDismissed: () => {
                if (!this.state.isLoading) {
                  this.setState({
                    yahooFinanceList: [],
                    showFinanceResults: false,
                    isError: false,
                    isDuplicate: false,
                    isSuccess: false,
                    noResults: false
                  });
                }
              }
            }}
          >
            {this.state.isSuccess && <this.SuccessNotify />}
            {this.state.isError && <this.ErrorNotify />}
            {this.state.noResults && <this.ErrorNotifyNoResults />}
            {this.state.isDuplicate && <this.ErrorNotifyDuplicate />}
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Search within Yahoo Finance</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              <SearchBox
                styles={searchBoxStyles}
                placeholder="Company Name"
                onSearch={this._showFinanceResults.bind(null, true)}
              />
              <div className={"center"}>
                <Stack tokens={sectionStackTokens}>
                  {this.state.showFinanceResults &&
                    this.state.yahooFinanceList.map(element => (
                      <Card
                        key={element[1]}
                        onClick={async () => {
                          try {
                            let currentConfig = [];
                            let config = await loadConfig();
                            config.finance.forEach(item => {
                              currentConfig.push(item.ticker);
                            });

                            if (currentConfig.some(x => x === element)) {
                              this.setState({
                                isError: false,
                                isDuplicate: true,
                                isSuccess: false,
                                showFinanceSetUp: true,
                                showFinanceSearch: true,
                                showFinanceResults: false
                              });
                            } else {
                              addFinanceConfig({ ticker: element, interval: "1d", range: "1y" });
                              this.setState({
                                isSuccess: true,
                                noResults: false,
                                showFinanceSearch: true,
                                showFinanceResults: false
                              });
                            }
                          } catch (error) {
                            console.error(error);
                            this.setState({
                              isSuccess: false,
                              isError: true,
                              isDuplicate: false,
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
              </div>
            </Stack>
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showFinanceSearch: false,
                    isError: false,
                    isDuplicate: false,
                    isSuccess: false,
                    noResults: false
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
                  showFinanceSetUp: false,
                  isError: false,
                  isDuplicate: false,
                  isSuccess: false,
                  noResults: false
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
