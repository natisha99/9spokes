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
import { populateLinkedIn } from "../sheets/population";
import { searchLinkedin } from "../sheets/api";
import { loadConfig, removeLinkedinConfig, addLinkedinConfig } from "../sheets/config";

export interface LinkedInState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  showRefreshButton: boolean;
  isSuccessHome: boolean;
  isErrorHome: boolean;
  emptyLinkedinSearch: boolean;
  showLinkedinSearch: boolean;
  showLinkedinRows: boolean;
  showLinkedinResults: boolean;
  linkedinName: string;
  linkedInList: any;
  linkedInRows: any;
  showLinkedinSetUp: boolean;
  noWorkbook: boolean;
}

export default class LinkedInRender extends React.Component<any, LinkedInState> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: false,
      isSuccess: false,
      isError: false,
      showRefreshButton: false,
      isSuccessHome: false,
      isErrorHome: false,
      emptyLinkedinSearch: false,
      showLinkedinSearch: false,
      showLinkedinRows: false,
      showLinkedinResults: false,
      linkedinName: "",
      linkedInList: [],
      linkedInRows: [],
      showLinkedinSetUp: false,
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

  _showLinkedinSearch = async bool => {
    this.setState({
      showLinkedinRows: false,
      showLinkedinSearch: bool,
      isSuccess: false,
      isError: false
    });
  };

  _showLinkedinRows = async bool => {
    this.setState({
      showLinkedinSearch: false,
      isSuccess: false,
      isError: false,
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
    this.setState({
      isLoading: true,
      isError: false,
      isSuccess: false,
      emptyLinkedinSearch: false,
      showLinkedinSetUp: false,
      showLinkedinSearch: false,
      showLinkedinResults: bool,
      linkedinName: val
    });

    if (val.trim() == "") {
      this.setState({
        emptyLinkedinSearch: true,
        isError: true,
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
        isSuccess: false,
        showLinkedinSetUp: true,
        linkedInList: (await searchLinkedin(val)).results,
        showLinkedinSearch: true,
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

    const sectionStackTokens: IStackTokens = { childrenGap: 30 };
    const cardTokens: ICardTokens = { childrenMargin: 12 };
    const footerCardSectionTokens: ICardSectionTokens = { padding: "12px 0px 0px" };

    const agendaCardSectionTokens: ICardSectionTokens = { childrenGap: 0 };

    return (
      <div>
        {/* Companies House NZ */}
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
              isError: false
            })
          }
          modalProps={{
            onDismissed: () => {
              if (!this.state.isLoading) {
                this.setState({
                  showLinkedinSetUp: false,
                  isSuccess: false,
                  isError: false
                });
              }
            }
          }}
        >
          {!this.state.showLinkedinSearch && this.state.isSuccess && <this.SuccessNotify />}
          {!this.state.showLinkedinSearch && this.state.isError && <this.ErrorNotify />}
          {this.state.noWorkbook && <this.ErrorNotifyNoWorkbook />}
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
                    isError: false
                  })
                }
              />
              <DefaultButton
                className="configButton"
                text="Import LinkedIn"
                iconProps={{ iconName: "ChevronRight" }}
                onClick={async () => {
                  try {
                    this.setState({ isLoading: true, showLinkedinSetUp: false });
                    let config = await loadConfig();

                    if (config.linkedin === undefined || config.linkedin.length == 0) {
                      this.setState({ isError: true, isSuccess: false, isLoading: false, showLinkedinSetUp: true });
                    } else {
                      await populateLinkedIn();
                      this.setState({ isLoading: false, isSuccess: true, showLinkedinSetUp: true });
                    }
                  } catch (error) {
                    console.error(error);
                    this.setState({ isLoading: false, noWorkbook: true, showLinkedinSetUp: true });
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
                isSuccess: false
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
                    isSuccess: false
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
                isSuccess: false
              })
            }
            modalProps={{
              onDismissed: () => {
                if (!this.state.isLoading) {
                  this.setState({
                    linkedInList: [],
                    showLinkedinResults: false,
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
                            addLinkedinConfig({ profileName: element });
                            this.setState({
                              isSuccess: true,
                              showLinkedinSearch: true,
                              showLinkedinResults: false
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
              </div>
            </Stack>
            <DialogFooter className={"center"}>
              <PrimaryButton
                onClick={() =>
                  this.setState({
                    showLinkedinSearch: false,
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
                  showLinkedinSetUp: false,
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
