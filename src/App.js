import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AreaListPaper from './components/AreaListPaper'
import CameraListPaper from './components/CameraListPaper'
import BaseMap from './components/BaseMap';

function App() {
    let areas = [
        {
            "area_id": 88,
            "level": 1,
            "name": "a",
            "points": [
                [
                    52.44289527839814,
                    35.1928132445739
                ],
                [
                    52.366532390458445,
                    35.22886823713014
                ],
                [
                    52.32586760054042,
                    35.20290019860332
                ],
                [
                    52.44289527839814,
                    35.1928132445739
                ]
            ]
        },
        {
            "area_id": 94,
            "level": 22,
            "name": "radix",
            "points": [
                [
                    51.415006698608096,
                    35.691246573478466
                ],
                [
                    51.404192031860475,
                    35.6987051240133
                ],
                [
                    51.38342100524832,
                    35.688179303575154
                ],
                [
                    51.415006698608096,
                    35.691246573478466
                ]
            ]
        },
        {
            "area_id": 95,
            "level": 215,
            "name": "navidd",
            "points": [
                [
                    50.63682823115303,
                    36.47604666950977
                ],
                [
                    50.59666294442934,
                    36.5091046443122
                ],
                [
                    50.55543367660087,
                    36.44881217328573
                ],
                [
                    50.63682823115303,
                    36.47604666950977
                ]
            ]
        },
        {
            "area_id": 96,
            "level": 2,
            "name": "aa",
            "points": [
                [
                    51.243588611767166,
                    35.66604842102136
                ],
                [
                    51.269696388111555,
                    35.686991447106365
                ],
                [
                    51.164377109797215,
                    35.70419122376957
                ],
                [
                    51.08629557587591,
                    35.64127114760667
                ],
                [
                    51.243588611767166,
                    35.66604842102136
                ]
            ]
        },
        {
            "area_id": 97,
            "level": 22,
            "name": "aa",
            "points": [
                [
                    50.29774883075902,
                    35.490280598299805
                ],
                [
                    49.072677086284074,
                    36.17913116335292
                ],
                [
                    48.06379447318625,
                    34.84005583147402
                ],
                [
                    50.29774883075902,
                    35.490280598299805
                ]
            ]
        },
        {
            "area_id": 98,
            "level": 2,
            "name": "aa",
            "points": [
                [
                    51.91257858821231,
                    29.432597989190313
                ],
                [
                    51.47276268449798,
                    30.884517669544636
                ],
                [
                    50.4331978211701,
                    30.126654143262698
                ],
                [
                    51.91257858821231,
                    29.432597989190313
                ]
            ]
        },
        {
            "area_id": 99,
            "level": 6,
            "name": "g",
            "points": [
                [
                    51.46210610590538,
                    35.714959043140624
                ],
                [
                    51.44215646018225,
                    35.725324921627674
                ],
                [
                    51.430984658576364,
                    35.70372781968881
                ],
                [
                    51.46210610590538,
                    35.714959043140624
                ]
            ]
        },
        {
            "area_id": 100,
            "level": 2,
            "name": "ax",
            "points": [
                [
                    51.439116500876935,
                    35.69227759761485
                ],
                [
                    51.3437566182632,
                    35.7570778300543
                ],
                [
                    51.28088973268706,
                    35.665309770887575
                ],
                [
                    51.439116500876935,
                    35.69227759761485
                ]
            ]
        },
        {
            "area_id": 101,
            "level": 4,
            "name": "yyyy",
            "points": [
                [
                    51.408514682814314,
                    35.696832003918274
                ],
                [
                    51.358598113880504,
                    35.72699843921629
                ],
                [
                    51.33512137141312,
                    35.68702082606788
                ],
                [
                    51.408514682814314,
                    35.696832003918274
                ]
            ]
        }
    ]
    // ---------------------------------Area list--------------------------------------------------------------------------
    const [areaList, setAreaList] = useState({
        type: 'FeatureCollection',
        features: [],
    });

    useEffect(() => {
        setAreaList({
            type: 'FeatureCollection',
            features: areas.map(el => ({
                type: 'Feature',
                properties: {
                    area_id: el.area_id,
                    level: el.level,
                    name: el.name,
                },
                geometry: {type: 'Polygon', coordinates: [el.points]},
            })),
        });
    }, [areas]);

    // ---------------------------------Camera list--------------------------------------------------------------------------
    const [cameraList, setCameraList] = useState({
        type: 'FeatureCollection',
        features: [],
    });

    // useEffect(() => {
    //     const filtered = allCameras.filter(el => el[7] !== null && el[8] !== null);
    //     setCameraList({
    //         type: 'FeatureCollection',
    //         features: filtered.map(el => ({
    //             type: 'Feature',
    //             properties: {props: el},
    //             geometry: {type: 'Point', coordinates: [el[8], el[7]]},
    //         })),
    //     });
    // }, []);

    //= =================================================================================================
    const [changeVisibility, setChangeVisibility] = useState(false);
    const [correctItem, setCorrectItem] = useState(false);
    const [removeItem, setRemoveItem] = useState(false);

    const switchVisibility = args => {
        setChangeVisibility(args);
    };
    const editItem = args => {
        setCorrectItem(args);
    };
    const deleteItem = args => {
        setRemoveItem(args);
    };

    const useStyles = makeStyles(theme => ({
        container: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
        },
        baseMap: {
            width: '98%',
            height: '100%',
            backgroundColor: 'lightblue'
        },
        listPaper: {
            width: '35%',
            zIndex: 2,
        },
        okButton: {
            backgroundColor: '#81CFC8',
            marginTop: '10px',
            borderRadius: '5px',
            color: theme.palette.common.white,
            zIndex: 2,
        },
        disabled: {
            backgroundColor: theme.palette.grey[300],
        },
        btnRoot: {
            '&:hover': {
                color: '#81CFC8',
            },
        },
    }));
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.baseMap}>
                <BaseMap
                    areaList={areaList}
                    setAreaList={setAreaList}
                    cameraList={cameraList}
                    setCameraList={setCameraList}
                    changeVisibility={changeVisibility}
                    setChangeVisibility={setChangeVisibility}
                    correctItem={correctItem}
                    setCorrectItem={setCorrectItem}
                    removeItem={removeItem}
                    setRemoveItem={setRemoveItem}
                />
            </div>
            <div className={classes.listPaper}>
                <AreaListPaper
                    areaList={areaList}
                    switchVisibility={switchVisibility}
                    editItem={editItem}
                    deleteItem={deleteItem}
                />
                <CameraListPaper
                    cameraList={cameraList}
                    switchVisibility={switchVisibility}
                    editItem={editItem}
                    deleteItem={deleteItem}
                />
            </div>
        </div>
    );
}

export default App;
