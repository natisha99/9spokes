import * as React from "react";
import { MessageBar, MessageBarType, Dialog, PrimaryButton, DialogFooter } from "office-ui-fabric-react";
import { DefaultButton } from "office-ui-fabric-react";
import { SearchBox, ISearchBoxStyles } from "office-ui-fabric-react/lib/SearchBox";
import { Stack, IStackTokens } from "office-ui-fabric-react/lib/Stack";
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from "@uifabric/react-cards";
import { FontWeights } from "@uifabric/styling";
import { Text, ITextStyles } from "office-ui-fabric-react";
import { populateLinkedIn } from "../sheets/population";
import { searchLinkedin } from "../sheets/api";
import { loadConfig, removeLinkedinConfig, addLinkedinConfig } from "../sheets/config";

export interface LinkedInState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDuplicate: boolean;
  noResults: boolean;
  showRefreshButton: boolean;
  emptyLinkedinSearch: boolean;
  showLinkedinSearch: boolean;
  showLinkedinRows: boolean;
  showLinkedinResults: boolean;
  linkedinName: string;
  linkedInList: any;
  linkedInRows: any;
  showLinkedinSetUp: boolean;
}

export default class LinkedInRender extends React.Component<any, LinkedInState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
      showRefreshButton: false,
      emptyLinkedinSearch: false,
      showLinkedinSearch: false,
      showLinkedinRows: false,
      showLinkedinResults: false,
      linkedinName: "",
      linkedInList: [],
      linkedInRows: [],
      showLinkedinSetUp: false
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

  _showLinkedinSearch = async bool => {
    this.setState({
      showLinkedinRows: false,
      showLinkedinSearch: bool,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false
    });
  };

  _showLinkedinRows = async bool => {
    this.setState({
      showLinkedinSearch: false,
      isSuccess: false,
      isError: false,
      isDuplicate: false,
      noResults: false,
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

  _showLinkedinResults = async (bool, val) => {
    this.props.isLoading(true);
    this.setState({
      isLoading: true,
      isError: false,
      isDuplicate: false,
      noResults: false,
      isSuccess: false,
      emptyLinkedinSearch: false,
      showLinkedinSetUp: false,
      showLinkedinSearch: false,
      showLinkedinResults: bool,
      linkedinName: val
    });

    if (val.trim() == "") {
      this.props.isLoading(false);
      this.setState({
        emptyLinkedinSearch: true,
        isError: true,
        isDuplicate: false,
        noResults: false,
        isSuccess: false,
        showLinkedinResults: false,
        showLinkedinSetUp: true,
        isLoading: false,
        showLinkedinSearch: true
      });
    } else {
      this.setState({
        emptyLinkedinSearch: false,
        isError: false,
        isDuplicate: false,
        isSuccess: false,
        noResults: false,
        showLinkedinSetUp: true,
        linkedInList: (await searchLinkedin(val)).results,
        showLinkedinSearch: true,
        isLoading: false
      });
      if (this.state.linkedInList == undefined || this.state.linkedInList.length == 0) {
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
        {/* LinkedIn */}
        <DefaultButton
          className="apiButton"
          text="LinkedIn"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={() => this.setState({ showLinkedinSetUp: true })}
        />
        <Dialog
          hidden={!this.state.showLinkedinSetUp}
          onDismiss={() =>
            this.setState({
              showLinkedinSetUp: false,
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
                  showLinkedinSetUp: false,
                  isSuccess: false,
                  isError: false,
                  isDuplicate: false,
                  noResults: false
                });
              }
            }
          }}
        >
          {!this.state.showLinkedinSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showLinkedinSearch && this.state.isError && <this.ErrorNotify />}
          <div className={"centerText"}>
            <Text className={"setUpHeaders"}>LinkedIn</Text>
          </div>
          <br />
          <div className={"center"}>
            <Stack tokens={stackTokens}>
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
                onClick={() =>
                  this.setState({
                    showLinkedinSearch: true,
                    emptyLinkedinSearch: false,
                    isSuccess: false,
                    isError: false,
                    isDuplicate: false,
                    noResults: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import LinkedIn"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.props.isLoading(true);
                    this.setState({ isLoading: true, showLinkedinSetUp: false });
                    let config = await loadConfig();

                    if (config.linkedin === undefined || config.linkedin.length == 0) {
                      this.props.isLoading(false);
                      this.setState({
                        isError: true,
                        isDuplicate: false,
                        noResults: false,
                        isSuccess: false,
                        isLoading: false,
                        showLinkedinSetUp: true
                      });
                    } else {
                      await populateLinkedIn();
                      this.props.isLoading(false);
                      this.setState({ isLoading: false, isSuccess: true, showLinkedinSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.props.isLoading(false);
                    this.setState({
                      isLoading: false,
                      isDuplicate: false,
                      noResults: false,
                      isError: true,
                      showLinkedinSetUp: true
                    });
                  }
                }}
              />
            </Stack>
          </div>
          <Dialog
            hidden={!this.state.showLinkedinRows}
            onDismiss={() =>
              this.setState({
                showLinkedinRows: false,
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
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showLinkedinRows: false,
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
            hidden={!this.state.showLinkedinSearch}
            onDismiss={() =>
              this.setState({
                showLinkedinSearch: false,
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
                    linkedInList: [],
                    showLinkedinResults: false,
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
            {this.state.isDuplicate && <this.ErrorNotifyDuplicate />}
            <div className={"centerText"}>
              <Text className={"setUpHeaders"}>Search within LinkedIn</Text>
            </div>
            <br />
            <Stack tokens={stackTokens}>
              <SearchBox
                styles={searchBoxStyles}
                placeholder="Company profile name"
                onSearch={this._showLinkedinResults.bind(null, true)}
              />
              <div className={"center"}>
                <Stack tokens={sectionStackTokens}>
                  {this.state.showLinkedinResults &&
                    this.state.linkedInList.map(element => (
                      <Card
                        key={element[1]}
                        onClick={async () => {
                          try {
                            let currentConfig = [];
                            let config = await loadConfig();
                            config.linkedin.forEach(item => {
                              currentConfig.push(item.profileName);
                            });

                            if (currentConfig.some(x => x === element)) {
                              this.setState({
                                isError: false,
                                isDuplicate: true,
                                isSuccess: false,
                                showLinkedinSetUp: true,
                                showLinkedinSearch: true,
                                showLinkedinResults: false
                              });
                            } else {
                              addLinkedinConfig({ profileName: element });
                              this.setState({
                                isSuccess: true,
                                noResults: false,
                                showLinkedinSearch: true,
                                showLinkedinResults: false
                              });
                            }
                          } catch (error) {
                            console.error(error);
                            this.setState({
                              isSuccess: false,
                              isError: true,
                              isDuplicate: false,
                              showLinkedinSearch: true
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
              </div>
            </Stack>
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showLinkedinSearch: false,
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
                  showLinkedinSetUp: false,
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
