import * as React from "react";
import { MessageBar, MessageBarType, Dialog, PrimaryButton, DialogFooter } from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import { populateHouseNZ } from "../sheets/population";
import { searchHouseNZ } from "../sheets/api";
import { loadConfig, addHouseNZConfig, removeHouseNZConfig } from "../sheets/config";

export interface HouseNZState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDuplicate: boolean;
  noResults: boolean;
  showRefreshButton: boolean;
  emptyHouseNZSearch: boolean;
  showHouseNZSearch: boolean;
  showHouseNZRows: boolean;
  showHouseResults: boolean;
  companiesHouseNZName: string;
  companiesHouseNZList: any;
  houseNZRows: any;
  showHouseNZSetUp: boolean;
}

export default class HouseNZRender extends React.Component<any, HouseNZState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
      showRefreshButton: false,
      emptyHouseNZSearch: false,
      showHouseNZSearch: false,
      showHouseNZRows: false,
      showHouseResults: false,
      companiesHouseNZName: "",
      companiesHouseNZList: [],
      houseNZRows: [],
      showHouseNZSetUp: false
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

  _showHouseNZSearch = async bool => {
    this.setState({
      showHouseNZRows: false,
      showHouseNZSearch: bool,
      isSuccess: false,
      isDuplicate: false,
      isError: false,
      noResults: false
    });
  };

  // Called when user clicks "Show current set-up" to display current configs
  _showHouseNZRows = async bool => {
    this.setState({
      showHouseNZSearch: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
      isSuccess: false,
      showHouseNZRows: bool,
      houseNZRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.houseNZ.forEach((item, i) => {
      temp.push([i, item.companyName, item.companyNumber]);
    });
    this.setState({ houseNZRows: temp });
  };

  // Called when the onSearch handler is invoked to display search results
  _showHouseNZResults = async (bool, val) => {
    this.props.isLoading(true);
    this.setState({
      isLoading: true,
      isError: false,
      isDuplicate: false,
      noResults: false,
      isSuccess: false,
      showHouseNZSearch: false,
      showHouseNZSetUp: false,
      showHouseResults: bool,
      companiesHouseNZName: val
    });
    if (val.trim() == "") {
      this.props.isLoading(false);
      this.setState({
        isError: true,
        isDuplicate: false,
        noResults: false,
        isSuccess: false,
        showHouseResults: false,
        showHouseNZSetUp: true,
        isLoading: false,
        showHouseNZSearch: true
      });
    } else {
      this.setState({
        isError: false,
        isDuplicate: false,
        noResults: false,
        isSuccess: false,
        companiesHouseNZList: (await searchHouseNZ(val)).results,
        showHouseNZSearch: true,
        showHouseNZSetUp: true,
        isLoading: false
      });
      if (this.state.companiesHouseNZList == undefined || this.state.companiesHouseNZList.length == 0) {
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
        {/* Companies House NZ */}
        <DefaultButton
          className="apiButton"
          text="Companies Office NZ"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => this.setState({ showHouseNZSetUp: true })}
        />
        <Dialog
          hidden={!this.state.showHouseNZSetUp}
          onDismiss={() =>
            this.setState({
              showHouseNZSetUp: false,
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
                  showHouseNZSetUp: false,
                  isSuccess: false,
                  isError: false,
                  isDuplicate: false,
                  noResults: false
                });
              }
            }
          }}
        >
          {!this.state.showHouseNZSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showHouseNZSearch && this.state.isError && <this.ErrorNotify />}
          <div className={"centerText"}>
            <Text className={"setUpHeaders"}>Companies Office NZ</Text>
          </div>
          <br />
          <div className={"center"}>
            <Stack tokens={stackTokens}>
              <DefaultButton
                className="configButton"
                text="Show current set-up"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this._showHouseNZRows.bind(null, true)}
              />
              <DefaultButton
                className="configButton"
                text="Add another company"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() =>
                  this.setState({
                    showHouseNZSearch: true,
                    emptyHouseNZSearch: false,
                    isSuccess: false,
                    isError: false,
                    isDuplicate: false,
                    noResults: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import Companies Office"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.props.isLoading(true);
                    this.setState({ isLoading: true, showHouseNZSetUp: false });
                    let config = await loadConfig();

                    if (config.houseNZ === undefined || config.houseNZ.length == 0) {
                      this.props.isLoading(false);
                      this.setState({
                        isError: true,
                        isDuplicate: false,
                        noResults: false,
                        isSuccess: false,
                        isLoading: false,
                        showHouseNZSetUp: true
                      });
                    } else {
                      await populateHouseNZ();
                      this.props.isLoading(false);
                      this.setState({
                        isLoading: false,
                        isError: false,
                        isDuplicate: false,
                        noResults: false,
                        isSuccess: true,
                        showHouseNZSetUp: true
                      });
                    }
                  } catch (error) {
                    console.error(error);
                    this.props.isLoading(false);
                    this.setState({
                      isLoading: false,
                      isSuccess: false,
                      isDuplicate: false,
                      noResults: false,
                      isError: true,
                      showHouseNZSetUp: true
                    });
                  }
                }}
              />
            </Stack>
          </div>
          <Dialog
            hidden={!this.state.showHouseNZRows}
            onDismiss={() =>
              this.setState({
                showHouseNZRows: false,
                isError: false,
                isDuplicate: false,
                noResults: false,
                isSuccess: false
              })
            }
          >
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Current set-up</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              {this.state.showHouseNZRows &&
                this.state.houseNZRows.map(element => (
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
                            removeHouseNZConfig(element[0]);
                            let temp = [];
                            let config = await loadConfig();
                            config.houseNZ.forEach((item, i) => {
                              temp.push([i, item.companyName, item.companyNumber]);
                            });
                            this.setState({ houseNZRows: temp });
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
                    showHouseNZRows: false,
                    isError: false,
                    isDuplicate: false,
                    noResults: false,
                    isSuccess: false
                  })
                }
                text="Back"
              />
            </DialogFooter>
          </Dialog>

          <Dialog
            hidden={!this.state.showHouseNZSearch}
            onDismiss={() =>
              this.setState({
                showHouseNZSearch: false,
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
                    companiesHouseNZList: [],
                    showHouseResults: false,
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
              <Text className={"setUpHeaders"}>Search within Companies House NZ</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              <SearchBox
                styles={searchBoxStyles}
                placeholder="Company Name"
                onSearch={this._showHouseNZResults.bind(null, true)}
              />
              <div className={"center"}>
                <Stack tokens={sectionStackTokens}>
                  {this.state.showHouseResults &&
                    this.state.companiesHouseNZList.map(element => (
                      <Card
                        key={element[1]}
                        onClick={async () => {
                          try {
                            let currentConfig = [];
                            let config = await loadConfig();
                            config.houseNZ.forEach(item => {
                              currentConfig.push(item.companyNumber);
                            });

                            if (currentConfig.some(x => x === element[1])) {
                              this.setState({
                                isError: false,
                                isDuplicate: true,
                                isSuccess: false,
                                showHouseNZSetUp: true,
                                showHouseNZSearch: true,
                                showHouseResults: false
                              });
                            } else {
                              addHouseNZConfig({ companyName: element[0], companyNumber: element[1] });
                              this.setState({
                                isSuccess: true,
                                isDuplicate: false,
                                noResults: false,
                                showHouseNZSearch: true,
                                showHouseResults: false
                              });
                            }
                          } catch (error) {
                            console.error(error);
                            this.setState({
                              isSuccess: false,
                              isError: true,
                              isDuplicate: false,
                              showHouseNZSearch: true
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
              </div>
            </Stack>
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showHouseNZSearch: false,
                    isError: false,
                    isDuplicate: false,
                    noResults: false,
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
                  showHouseNZSetUp: false,
                  isError: false,
                  isDuplicate: false,
                  noResults: false,
                  isSuccess: false
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
