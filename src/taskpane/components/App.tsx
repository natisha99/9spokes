import * as React from "react";
import {Button, ButtonType} from "office-ui-fabric-react";
import {Pivot, PivotItem} from "office-ui-fabric-react/lib/Pivot";
import Header from "./Header";
import HeroList, {HeroListItem} from "./HeroList";
import {SearchBox, ISearchBoxStyles} from "office-ui-fabric-react/lib/SearchBox";
import {Stack, IStackTokens} from "office-ui-fabric-react/lib/Stack";
import Title from "./Title";
import Progress from "./Progress";
import {Card, ICardTokens, ICardSectionStyles, ICardSectionTokens} from '@uifabric/react-cards';
import {FontWeights} from '@uifabric/styling';
import {
    Text,
    ITextStyles,
} from 'office-ui-fabric-react';
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
import {searchCompany} from "../sheets/api";

//import { SourceMapDevToolPlugin } from "webpack";
/* global Button, console, Excel, Header, HeroList, HeroListItem, Progress */

const alertClicked = (data: string): void => {
    console.log(data + ' is Clicked');
};

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export interface AppState {
    listItems: HeroListItem[];
    showSearchResults: boolean;
    companyName: string;
    companyList: any;
    companySelected: string
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            listItems: [],
            showSearchResults: false,
            companyName: "",
            companyList: [],
            companySelected: ""
        };
    }

    _showSearchResults = async (bool, val) => {
        this.setState({
            showSearchResults: bool,
            companyName: val
        });

        this.setState({companyList: await searchCompany(val)});
        // this.search(val);
    };

    // search = query => {
    //   const url = `https://projectapi.co.nz/api/nzcompaniesoffice/search/?keyword=${query.replace(" ", "+")}`;

    //   fetch(url)
    //     .then(results => results.json())
    //     .then(data => {
    //       this.setState({ companyList: data.results });

    //     });
    // };

    componentDidMount() {
        this.setState({
            listItems: [
                {
                    icon: "Ribbon",
                    primaryText: "Achieve more with Office integration"
                },
                {
                    icon: "Unlock",
                    primaryText: "Unlock features and functionality"
                },
                {
                    icon: "Design",
                    primaryText: "Create and visualize like a pro"
                }
            ]
        });
    }

    /**
     * Creates a new workbook using the template file prototype.xlsm
     */
    loadTemplate = async () => {
        try {
            Excel.run(async function (context) {
                var templateFile = await (await fetch("/prototype.xlsm")).blob();
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
        const {title, isOfficeInitialized} = this.props;
        const stackTokens: Partial<IStackTokens> = {childrenGap: 20, maxWidth: 250};
        const searchBoxStyles: Partial<ISearchBoxStyles> = {root: {width: 250}};
        // const siteTextStyles: ITextStyles = {
        //     root: {
        //         color: '#025F52',
        //         fontWeight: FontWeights.semibold,
        //     },
        // };
        const descriptionTextStyles: ITextStyles = {
            root: {
                color: '#333333',
                fontWeight: FontWeights.semibold,
            },
        };
        // const helpfulTextStyles: ITextStyles = {
        //     root: {
        //         color: '#333333',
        //         fontWeight: FontWeights.regular,
        //     },
        // };
        // const iconStyles: IIconStyles = {
        //     root: {
        //         color: '#0078D4',
        //         fontSize: 16,
        //         fontWeight: FontWeights.regular,
        //     },
        // };
        const footerCardSectionStyles: ICardSectionStyles = {
            root: {
                borderTop: '1px solid #F3F2F1',
            },
        };
        // const backgroundImageCardSectionStyles: ICardSectionStyles = {
        //     root: {
        //         backgroundImage: 'url(https://placehold.it/256x144)',
        //         backgroundPosition: 'center center',
        //         backgroundSize: 'cover',
        //         height: 144,
        //     },
        // };
        // const dateTextStyles: ITextStyles = {
        //     root: {
        //         color: '#505050',
        //         fontWeight: 600,
        //     },
        // };
        const subduedTextStyles: ITextStyles = {
            root: {
                color: '#666666',
            },
        };
        // const actionButtonStyles: IButtonStyles = {
        //     root: {
        //         border: 'none',
        //         color: '#333333',
        //         height: 'auto',
        //         minHeight: 0,
        //         minWidth: 0,
        //         padding: 0,
        //
        //         selectors: {
        //             ':hover': {
        //                 color: '#0078D4',
        //             },
        //         },
        //     },
        //     textContainer: {
        //         fontSize: 12,
        //         fontWeight: FontWeights.semibold,
        //     },
        // };

        const sectionStackTokens: IStackTokens = {childrenGap: 30};
        const cardTokens: ICardTokens = {childrenMargin: 12};
        const footerCardSectionTokens: ICardSectionTokens = {padding: '12px 0px 0px'};
        // const backgroundImageCardSectionTokens: ICardSectionTokens = {padding: 12};
        const agendaCardSectionTokens: ICardSectionTokens = {childrenGap: 0};
        // const attendantsCardSectionTokens: ICardSectionTokens = {childrenGap: 6};
        if (!isOfficeInitialized) {
            return (
                <Progress title={title} logo="assets/logo-filled.png"
                          message="Please sideload your addin to see app body."/>
            );
        }

        //Creates a menu bar on the top (Home, import, help), I've just added those for now, can change later.
        //This helps to separate the task pane into separate pages so the functionality isn't squashed into one place
        return (
            <div className="ms-welcome">
                <Pivot>
                    <PivotItem headerText="Home">
                        <Header logo="assets/logo-filled.png" title={this.props.title} message="Welcome"/>
                        <Title message="Create a new worksheet to get started">
                            <Button
                                className="ms-welcome__action"
                                buttonType={ButtonType.hero}
                                iconProps={{iconName: "ChevronRight"}}
                                onClick={this.loadTemplate}
                            >
                                Create workbook from template
                            </Button>
                        </Title>
                    </PivotItem>
                    <PivotItem headerText="Set-up">
                        <Title message="Search by company name">
                            <Stack tokens={stackTokens}>
                                <SearchBox
                                    styles={searchBoxStyles}
                                    placeholder="Company Name"
                                    onSearch={this._showSearchResults.bind(null, true)}
                                    // onEscape={this._showSearchResults.bind(null, false)}
                                    // onClear={this._showSearchResults.bind(null, false)}
                                    // onChange={this._showSearchResults.bind(null, false)}
                                />
                                <br/>
                                {this.state.showSearchResults && "Search results for: " + this.state.companyName}
                                <br/>
                                <br/>
                                <Stack tokens={sectionStackTokens}>
                                    {this.state.showSearchResults && this.state.companyList.map((element) =>
                                        <Card
                                            aria-label="Clickable vertical card with image bleeding at the top of the card"
                                            onClick={() => alertClicked(element[0])}
                                            tokens={cardTokens}
                                        >
                                            <Card.Section
                                                fill
                                                verticalAlign="end"
                                                // styles={backgroundImageCardSectionStyles}
                                                // tokens={backgroundImageCardSectionTokens}
                                            >
                                            </Card.Section>
                                            <Card.Section>
                                                <Text variant="small" styles={subduedTextStyles}>
                                                    Companies House NZ
                                                </Text>
                                                <Text styles={descriptionTextStyles}>{element[0]}</Text>
                                            </Card.Section>
                                            <Card.Section tokens={agendaCardSectionTokens}>
                                                <Text variant="small" styles={descriptionTextStyles}>
                                                    {element[1]}
                                                </Text>
                                            </Card.Section>
                                            <Card.Item grow={1}>
                                                <span/>
                                            </Card.Item>
                                            <Card.Section horizontal styles={footerCardSectionStyles}
                                                          tokens={footerCardSectionTokens}>
                                            </Card.Section>
                                        </Card>)}

                                </Stack>
                            </Stack>
                        </Title>
                    </PivotItem>
                    <PivotItem headerText="Import">
                        <Title message="Import data from...">
                            <Button
                                className="apiButton"
                                buttonType={ButtonType.hero}
                                iconProps={{iconName: "ChevronRight"}}
                                onClick={() => {
                                    try {
                                        populateHouse();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                Companies House
                            </Button>
                            <br/>
                            <Button
                                className="apiButton"
                                buttonType={ButtonType.hero}
                                iconProps={{iconName: "ChevronRight"}}
                                onClick={() => {
                                    try {
                                        populateTrends();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                Google Trends
                            </Button>
                            <br/>
                            <Button
                                className="apiButton"
                                buttonType={ButtonType.hero}
                                iconProps={{iconName: "ChevronRight"}}
                                onClick={() => {
                                    try {
                                        populateFinance();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                Yahoo Finance
                            </Button>
                            <br/>
                            <Button
                                className="apiButton"
                                buttonType={ButtonType.hero}
                                iconProps={{iconName: "ChevronRight"}}
                                onClick={() => {
                                    try {
                                        populateLinkedIn();
                                    } catch (error) {
                                        console.error(error);
                                    }
                                }}
                            >
                                LinkedIn
                            </Button>
                            <br/>
                            {/*
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateXero();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Xero
              </Button>
              <br />
              <Button
                className="apiButton"
                buttonType={ButtonType.hero}
                iconProps={{ iconName: "ChevronRight" }}
                onClick={() => {
                  try {
                    populateFacebook();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Facebook
              </Button>
              */}
                        </Title>
                    </PivotItem>
                    <PivotItem headerText="Help">
                        <HeroList
                            message="Discover what Office Add-ins can do for you today!"
                            items={this.state.listItems}
                        ></HeroList>
                    </PivotItem>
                </Pivot>
            </div>
        );
    }
}
