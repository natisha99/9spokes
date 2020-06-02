import * as React from "react";
import { MessageBar, MessageBarType, Dialog, PrimaryButton, DialogFooter } from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import { populateHouseUK } from "../sheets/population";
import { searchHouseUK } from "../sheets/api";
import { loadConfig, removeHouseUKConfig, addHouseUKConfig } from "../sheets/config";

export interface HouseUKState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  noResults: boolean;
  showRefreshButton: boolean;
  isSuccessHome: boolean;
  isErrorHome: boolean;
  emptyHouseUKSearch: boolean;
  showHouseUKSearch: boolean;
  showHouseUKRows: boolean;
  showHouseUKResults: boolean;
  companiesHouseUKName: string;
  companiesHouseUKList: any;
  houseUKRows: any;
  showHouseUKSetUp: boolean;
}

export default class HouseUKRender extends React.Component<any, HouseUKState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      noResults: false,
      showRefreshButton: false,
      isSuccessHome: false,
      isErrorHome: false,
      emptyHouseUKSearch: false,
      showHouseUKSearch: false,
      showHouseUKRows: false,
      showHouseUKResults: false,
      companiesHouseUKName: "",
      companiesHouseUKList: [],
      houseUKRows: [],
      showHouseUKSetUp: false
    };
  }

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

  ErrorNotifyNoResults = () => (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      onDismiss={() => this.setState({ isError: false, noResults: false })}
      dismissButtonAriaLabel="Close"
    >
      No Results Found
    </MessageBar>
  );

  _showHouseUKRows = async bool => {
    this.setState({
      showHouseUKSearch: false,
      isError: false,
      noResults: false,
      isSuccess: false,
      showHouseUKRows: bool,
      houseUKRows: []
    });

    let temp = [];
    let config = await loadConfig();
    config.houseUK.forEach((item, i) => {
      temp.push([i, item.companyName, item.companyNumber]);
    });
    this.setState({ houseUKRows: temp });
  };

  _showHouseUKResults = async (bool, val) => {
    this.props.isLoading(true);
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      noResults: false,
      showHouseUKSearch: true,
      showHouseUKSetUp: false,
      showHouseUKResults: bool,
      companiesHouseUKName: val
    });
    if (val.trim() == "") {
      this.props.isLoading(false);
      this.setState({
        isError: true,
        noResults: false,
        isSuccess: false,
        showHouseUKResults: false,
        showHouseUKSetUp: true,
        isLoading: false,
        showHouseUKSearch: true
      });
    } else {
      this.setState({
        isError: false,
        isSuccess: false,
        noResults: false,
        companiesHouseUKList: (await searchHouseUK(val)).results,
        showHouseUKSearch: true,
        showHouseUKSetUp: true,
        isLoading: false
      });
      if (this.state.companiesHouseUKList == undefined || this.state.companiesHouseUKList.length == 0) {
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
        {/* Companies House UK */}
        <DefaultButton
          className="apiButton"
          text="Companies House UK"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => this.setState({ showHouseUKSetUp: true })}
        />
        <Dialog
          hidden={!this.state.showHouseUKSetUp}
          onDismiss={() =>
            this.setState({
              showHouseUKSetUp: false,
              isSuccess: false,
              isError: false,
              noResults: false
            })
          }
          modalProps={{
            onDismissed: () => {
              if (!this.state.isLoading) {
                this.setState({
                  showHouseUKSetUp: false,
                  isSuccess: false,
                  isError: false,
                  noResults: false
                });
              }
            }
          }}
        >
          {!this.state.showHouseUKSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showHouseUKSearch && this.state.isError && <this.ErrorNotify />}
          <div className={"centerText"}>
            <Text className={"setUpHeaders"}>Companies House UK</Text>
          </div>
          <br />
          <div className={"center"}>
            <Stack tokens={stackTokens}>
              <DefaultButton
                className="configButton"
                text="Show current set-up"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={this._showHouseUKRows.bind(null, true)}
              />
              <DefaultButton
                className="configButton"
                text="Add another company"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() =>
                  this.setState({
                    showHouseUKSearch: true,
                    emptyHouseUKSearch: false,
                    isSuccess: false,
                    isError: false,
                    noResults: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import Companies House"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.props.isLoading(true);
                    this.setState({ isLoading: true, showHouseUKSetUp: false });
                    let config = await loadConfig();

                    if (config.houseUK === undefined || config.houseUK.length == 0) {
                      this.props.isLoading(false);
                      this.setState({
                        isError: true,
                        noResults: false,
                        isSuccess: false,
                        isLoading: false,
                        showHouseUKSetUp: true
                      });
                    } else {
                      await populateHouseUK();
                      this.props.isLoading(false);
                      this.setState({ isLoading: false, isSuccess: true, showHouseUKSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.props.isLoading(false);
                    this.setState({ isLoading: false, noResults: false, isError: true, showHouseUKSetUp: true });
                  }
                }}
              />
            </Stack>
          </div>
          <Dialog
            hidden={!this.state.showHouseUKRows}
            onDismiss={() =>
              this.setState({
                showHouseUKRows: false,
                isError: false,
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
              {this.state.showHouseUKRows &&
                this.state.houseUKRows.map(element => (
                  <Card key={element} tokens={cardTokens}>
                    <Card.Section fill verticalAlign="end"></Card.Section>
                    <Card.Section>
                      <Text variant="small" styles={subduedTextStyles}>
                        Companies House UK
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
                            removeHouseUKConfig(element[0]);
                            let temp = [];
                            let config = await loadConfig();
                            config.houseUK.forEach((item, i) => {
                              temp.push([i, item.companyName, item.companyNumber]);
                            });
                            this.setState({ houseUKRows: temp });
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
                    showHouseUKRows: false,
                    isError: false,
                    isSuccess: false,
                    noResults: false
                  })
                }
                text="Back"
              />
            </DialogFooter>
          </Dialog>

          <Dialog
            hidden={!this.state.showHouseUKSearch}
            onDismiss={() =>
              this.setState({
                showHouseUKSearch: false,
                isError: false,
                isSuccess: false,
                noResults: false
              })
            }
            modalProps={{
              onDismissed: () => {
                if (!this.state.isLoading) {
                  this.setState({
                    companiesHouseUKList: [],
                    showHouseUKResults: false,
                    isError: false,
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
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Search within Companies House UK</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              <SearchBox
                styles={searchBoxStyles}
                placeholder="Company Name"
                onSearch={this._showHouseUKResults.bind(null, true)}
              />
              <div className={"center"}>
                <Stack tokens={sectionStackTokens}>
                  {this.state.showHouseUKResults &&
                    this.state.companiesHouseUKList.map(element => (
                      <Card
                        key={element[1]}
                        onClick={async () => {
                          try {
                            addHouseUKConfig({ companyName: element[0], companyNumber: element[1] });
                            this.setState({
                              isSuccess: true,
                              noResults: false,
                              showHouseUKSearch: true,
                              showHouseUKResults: false
                            });
                          } catch (error) {
                            console.error(error);
                            this.setState({
                              isSuccess: false,
                              isError: true,
                              showHouseUKSearch: false
                            });
                          }
                        }}
                        tokens={cardTokens}
                      >
                        <Card.Section fill verticalAlign="end"></Card.Section>
                        <Card.Section>
                          <Text variant="small" styles={subduedTextStyles}>
                            Companies House UK
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
                    showHouseUKSearch: false,
                    isError: false,
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
                  showHouseUKSetUp: false,
                  isError: false,
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
