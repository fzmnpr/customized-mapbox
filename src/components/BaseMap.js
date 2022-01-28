import React, {useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AreaForm from './AreaForm';
import CameraForm from './CameraForm';
import camera from '../asset/icons/cameraOnMap.png';
//
// import {addCoordinatesToCamera, createArea, deleteArea, deleteCoordinatesFromCamera, editArea,} from '../../actions';

const BaseMap = ({areaList, ...rest}) => {
    const {
        setAreaList,
        cameraList,
        setCameraList,
        allCameras,
        changeVisibility,
        setChangeVisibility,
        correctItem,
        setCorrectItem,
        removeItem,
        setRemoveItem,
    } = rest;

    //= =================================================== set useRef ====================================================

    const map = useRef(null);
    const nav = useRef(null);
    const draw = useRef(null);
    const mapContainer = useRef(null);
    const tooltipRef = useRef(
        new mapboxgl.Popup({
            closeOnClick: true,
            // focusAfterOpen: true,
        }),
    );
    const formRef = useRef(null);
    //= =============================================== initialize map (only once) ========================================
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                    },
                    areaSourceID: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [],
                        },
                    },
                },
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                    {
                        id: 'areaLayer',
                        type: 'fill',
                        source: 'areaSourceID',
                        paint: {
                            'fill-opacity': 0,
                        },
                    },
                ],
            },
            center: [51.389, 35.689],
            zoom: 13,
        });
    }, []);
    //= ============================================== initialize NavigationControl (only once) ========================================

    useEffect(() => {
        if (draw.current || !map.current) return; // initialize draw only once
        nav.current = new mapboxgl.NavigationControl();
        map.current.addControl(nav.current, 'top-left');
    }, []); // isn't better to set map in this deps ? for example maybe map is true after some seconds and then we want to create draw object

    //= ============================================== initialize draw (only once) ========================================
    useEffect(() => {
        if (draw.current || !map.current) return; // initialize draw only once
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            userProperties: true,
            controls: {
                polygon: true,
                line_string: true,
                point: true,
                trash: true,
            },
            styles: [
                {
                    id: 'active-points',
                    type: 'symbol',
                    filter: [
                        'all',
                        ['!has', 'user_portVis'],
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['==', 'active', 'true'],
                    ],
                    layout: {
                        'icon-image': 'camera',
                        'icon-size': 0.03,
                        'icon-anchor': 'bottom',
                    },
                },
                {
                    id: 'inactive-points',
                    type: 'symbol',
                    filter: [
                        'all',
                        ['!has', 'user_portVis'],
                        ['==', '$type', 'Point'],
                        ['==', 'meta', 'feature'],
                        ['==', 'active', 'false'],
                    ],
                    layout: {
                        'icon-image': 'camera',
                        'icon-size': 0.03,
                        'icon-anchor': 'bottom',
                    },
                },
                // polygon mid points
                {
                    id: 'gl-draw-polygon-midpoint',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
                    paint: {
                        'circle-radius': 3,
                        'circle-color': '#fbb03b',
                    },
                },
                // polygon outline stroke
                // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
                {
                    id: 'gl-draw-polygon-stroke-active',
                    type: 'line',
                    filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': '#4357BA',
                        'line-dasharray': [0.2, 2],
                        'line-width': 5,
                    },
                },
                // vertex point halos
                {
                    id: 'gl-draw-polygon-and-line-vertex-halo-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#FFF',
                    },
                },
                // vertex points
                {
                    id: 'gl-draw-polygon-and-line-vertex-active',
                    type: 'circle',
                    filter: [
                        'all',
                        ['==', 'meta', 'vertex'],
                        ['==', '$type', 'Point'],
                        ['!=', 'mode', 'static'],
                    ],
                    paint: {
                        'circle-radius': 3,
                        'circle-color': '#666ae7',
                    },
                },

                // INACTIVE (static, already drawn)
                // line stroke
                {
                    id: 'gl-draw-line-static',
                    type: 'line',
                    filter: [
                        'all',
                        ['==', '$type', 'LineString'],
                        ['==', 'mode', 'static'],
                    ],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': '#000',
                        'line-width': 3,
                    },
                },
                // ACTIVE (being drawn)
                // line stroke
                {
                    id: 'gl-draw-line',
                    type: 'line',
                    filter: [
                        'all',
                        ['==', '$type', 'LineString'],
                        ['!=', 'mode', 'static'],
                    ],
                    layout: {
                        'line-cap': 'round',
                        'line-join': 'round',
                    },
                    paint: {
                        'line-color': '#787bb8',
                        'line-dasharray': [0.2, 2],
                        'line-width': 2,
                    },
                },
                // polygon fill active
                {
                    id: 'gl-draw-polygon-fill-active',
                    type: 'fill',
                    filter: [
                        'all',
                        ['!has', 'user_portVis'],
                        ['==', '$type', 'Polygon'],
                        ['==', 'active', 'true'],
                    ],
                    layout: {
                        visibility: 'visible',
                    },
                    paint: {
                        'fill-color': '#6EC6BD',
                        'fill-outline-color': '#24ce9e',
                        'fill-opacity': 0.4,
                    },
                },
                // polygon fill inactive
                {
                    id: 'gl-draw-polygon-fill-inactive',
                    type: 'fill',
                    filter: [
                        'all',
                        ['!has', 'user_portVis'],
                        ['==', '$type', 'Polygon'],
                        ['==', 'active', 'false'],
                    ],
                    layout: {
                        visibility: 'visible',
                    },
                    paint: {
                        'fill-color': '#7dcba0',
                        'fill-outline-color': '#ecd715',
                        'fill-opacity': 0.6,
                    },
                },
                // end default themes provided by MB Draw
                // end default themes provided by MB Draw
                // end default themes provided by MB Draw

                // new styles for toggling visibility
                // new styles for toggling visibility
                // new styles for toggling visibility

                {
                    id: 'navid-polygon',
                    type: 'fill',
                    filter: ['all', ['has', 'user_portVis']],
                    layout: {
                        visibility: 'none',
                    },
                },
                {
                    id: 'navid-point',
                    type: 'circle',
                    filter: ['all', ['has', 'user_portVis']],
                    layout: {
                        visibility: 'none',
                    },
                },
            ],
        });
        map.current.addControl(draw.current, 'top-right');
    }, []); // isn't better to set map in this deps ? for example maybe map is true after some seconds and then we want to create draw object
    //= ======================================== add custom Image for showing camera on map ===============================
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('load', () => {
            map.current.loadImage(camera, (error, image) => {
                if (error) throw error;
                map.current.addImage('camera', image);
            });
        });
    }, []);
    //= ============================================ create & set tooltip for area ========================================
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('draw.selectionchange', e => {
            if (e.features[0] && e.features[0].geometry.type === 'Polygon') {
                const polygon = turf.polygon(e.features[0].geometry.coordinates);
                const center = turf.centerOfMass(polygon);
                const feature = e.features[0];
                // Create tooltip node
                const tooltipNode = document.createElement('div');
                ReactDOM.render(
                    <AreaForm
                        id="navid"
                        formRef={formRef}
                        feature={feature}
                        onSubmitClick={onSubmitArea}
                    />,
                    tooltipNode,
                );
                // Set tooltip on map
                tooltipRef.current
                    .setLngLat(center.geometry.coordinates)
                    .setDOMContent(tooltipNode)
                    .addTo(map.current);
            }
        });
    }, []);
    //= ========================================== create & set tooltip for camera ========================================
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('draw.selectionchange', e => {
            if (e.features[0] && e.features[0].geometry.type === 'Point') {
                const point = turf.point(e.features[0].geometry.coordinates);
                const center = turf.centerOfMass(point);
                const feature = e.features[0];
                // Create tooltip node
                const tooltipNode = document.createElement('div');
                ReactDOM.render(
                    <CameraForm
                        id="navid"
                        formRef={formRef}
                        allCameras={allCameras}
                        center={center}
                        feature={feature}
                        onSubmitClick={onSubmitCamera}
                    />,
                    tooltipNode,
                );
                // Set tooltip on map
                tooltipRef.current
                    .setLngLat(center.geometry.coordinates)
                    .setDOMContent(tooltipNode)
                    .addTo(map.current);
            }
        });
    }, [allCameras?.length]);
    //= ======================================= create & delete & update event ============================================
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        // map.current.on('draw.create', updateFeatures);
        map.current.on('draw.delete', deleteFeatures);
        map.current.on('draw.update', updateFeatures);
    }, []);

    //= ====================================== draw.update event ==========================================================
    const updateFeatures = el => {
        // we want if a feature has area_id and we move it (change coordinate means we need an put method(http-request)), the dispatch edit action
        if (el.features[0].properties.area_id) {
            const argsCopy = {...draw.current.get(el.features[0].id)};
            let res = '';
            argsCopy.geometry.coordinates[0].forEach((ele, index) => {
                if (index === argsCopy.geometry.coordinates[0].length - 1) {
                    res = `${res}(${ele[0]},${ele[1]})`;
                } else {
                    res = `${res}(${ele[0]},${ele[1]}),`;
                }
            });
            const back = `(${res})`;
            const oldArea = {
                area_id: draw.current.get(el.features[0].id).properties.area_id,
                name: argsCopy.properties.name,
                level: parseInt(argsCopy.properties.level, 10),
                points: back,
            };
            // dispatch(editArea(oldArea));
        } else if (el.features[0].properties.props[0]) {
            // dispatch(
            //     addCoordinatesToCamera({
            //         id: el.features[0].properties.props[0],
            //         payload: {
            //             long: el.features[0].geometry.coordinates[0],
            //             lat: el.features[0].geometry.coordinates[1],
            //         },
            //     }),
            // );
        }
    };
    //= ====================================== draw.delete event ==========================================================
    const deleteFeatures = el => {
        // we want if a feature has area_id and we delete it, the dispatch delete action
        if (el.features[0].properties.area_id) {
            // dispatch(deleteArea(el.features[0].properties.area_id));
        }
    };
    //= ======================================= Submit properties for area ================================================
    // set area properties
    function onSubmitArea(args) {
        if (
            draw.current.get(args.drawID).properties.name &&
            draw.current.get(args.drawID).properties.level &&
            draw.current.get(args.drawID).properties.area_id
        ) {
            draw.current.setFeatureProperty(args.drawID, 'name', args.areaName);
            draw.current.setFeatureProperty(args.drawID, 'level', args.areaLevel);
            const argsCopy = {...draw.current.get(args.drawID)};
            let res = '';
            argsCopy.geometry.coordinates[0].forEach((el, index) => {
                if (index === argsCopy.geometry.coordinates[0].length - 1) {
                    res = `${res}(${el[0]},${el[1]})`;
                } else {
                    res = `${res}(${el[0]},${el[1]}),`;
                }
            });
            const back = `(${res})`;
            const oldArea = {
                area_id: draw.current.get(args.drawID).properties.area_id,
                name: argsCopy.properties.name,
                level: parseInt(argsCopy.properties.level, 10),
                points: back,
            };
            // dispatch(editArea(oldArea));
        } else {
            draw.current.setFeatureProperty(args.drawID, 'name', args.areaName);
            draw.current.setFeatureProperty(args.drawID, 'level', args.areaLevel);
            const argsCopy = {...draw.current.get(args.drawID)};
            let res = '';
            argsCopy.geometry.coordinates[0].forEach((el, index) => {
                if (index === argsCopy.geometry.coordinates[0].length - 1) {
                    res = `${res}(${el[0]},${el[1]})`;
                } else {
                    res = `${res}(${el[0]},${el[1]}),`;
                }
            });
            const back = `(${res})`;
            const newArea = {
                name: argsCopy.properties.name,
                level: parseInt(argsCopy.properties.level, 10),
                points: back,
            };

            // dispatch(createArea(newArea));
        }
    }

    //= ====================================== Submit properties for camera ===============================================
    // set camera properties
    function onSubmitCamera(args) {
        draw.current.setFeatureProperty(args[9], 'props', args);
        const all = draw.current.getAll();
        const newTotalPoint = {
            ...all,
            features: all.features.filter(el => el.geometry.type === 'Point'),
        };
        setCameraList(newTotalPoint);
        // dispatch(
        //     addCoordinatesToCamera({
        //         id: args[0],
        //         payload: {long: args[7], lat: args[8]},
        //     }),
        // );
    }

    //= ==========  Set area list and camera list when areas and cameras from sever are received ==========================
    useEffect(() => {
        if (!draw.current) return; // wait for draw to initialize
        draw.current.set({
            type: 'FeatureCollection',
            features: [...areaList.features, ...cameraList.features],
        });
        const all = draw.current.getAll();
        const newTotalPolygon = {
            ...all,
            features: all.features.filter(el => el.geometry.type === 'Polygon'),
        };
        const newTotalPoint = {
            ...all,
            features: all.features.filter(el => el.geometry.type === 'Point'),
        };
        setAreaList(newTotalPolygon);
        setCameraList(newTotalPoint);
    }, [areaList.features.length, cameraList.features.length]);

    //= ============================================ change visibility ====================================================
    useEffect(() => {
        if (changeVisibility) {
            changeStatus(changeVisibility);
        }
        setChangeVisibility(false);
    }, [changeVisibility]);

    function changeStatus(args) {
        if (args.id !== '' && typeof draw === 'object') {
            if (args.properties.portVis) {
                draw.current.setFeatureProperty(args.id, 'portVis');
                const feat = draw.current.get(args.id);
                draw.current.add(feat);
            } else if (!args.properties.portVis) {
                draw.current.setFeatureProperty(args.id, 'portVis', 'none');
                const feat = draw.current.get(args.id);
                draw.current.add(feat);
            }
            if (args.geometry.type === 'Polygon') {
                setAreaList({
                    type: 'FeatureCollection',
                    features: draw.current
                        .getAll()
                        .features.filter(el => el.geometry.type === 'Polygon'),
                });
            } else if (args.geometry.type === 'Point') {
                setCameraList({
                    type: 'FeatureCollection',
                    features: draw.current
                        .getAll()
                        .features.filter(el => el.geometry.type === 'Point'),
                });
            }
        }
    }

    //= ================================= correct item properties (edit)  =================================================
    useEffect(() => {
        if (correctItem) {
            editItem(correctItem);
        }
        setCorrectItem(false);
    }, [correctItem]);

    function editItem(args) {
        if (args.id !== '' && typeof draw === 'object') {
            if (args.geometry.type === 'Polygon') {
                const polygon = turf.polygon(args.geometry.coordinates);
                const center = turf.centerOfMass(polygon);
                const bbox = turf.bbox(polygon);
                map.current.fitBounds(bbox, {padding: 20});
                //= ===========================================================
                const feature = args;
                // Create tooltip node
                const tooltipNode = document.createElement('div');
                ReactDOM.render(
                    <AreaForm
                        id="navid"
                        formRef={formRef}
                        feature={feature}
                        onSubmitClick={onSubmitArea}
                    />,
                    tooltipNode,
                );
                // Set tooltip on map
                tooltipRef.current
                    .setLngLat(center.geometry.coordinates)
                    .setDOMContent(tooltipNode)
                    .addTo(map.current);
            } else if (args.geometry.type === 'Point') {
                const point = turf.point(args.geometry.coordinates);
                const bbox = turf.bbox(point);
                map.current.fitBounds(bbox, {padding: 20});
            }
        }
    }

    //= ================================================== delete item ====================================================
    useEffect(() => {
        if (removeItem) {
            deleteItem(removeItem);
        }
        setRemoveItem(false);
    }, [removeItem]);

    function deleteItem(args) {
        if (args.id !== '' && typeof draw === 'object') {
            draw.current.delete(args.id);
            if (args.geometry.type === 'Polygon') {
                setAreaList({
                    type: 'FeatureCollection',
                    features: draw.current
                        .getAll()
                        .features.filter(el => el.geometry.type === 'Polygon'),
                });
                // dispatch(deleteArea(args.properties.area_id));
            } else if (args.geometry.type === 'Point') {
                setCameraList({
                    type: 'FeatureCollection',
                    features: draw.current
                        .getAll()
                        .features.filter(el => el.geometry.type === 'Point'),
                });
                // dispatch(
                //     deleteCoordinatesFromCamera({
                //         id: args.properties.props[0],
                //         payload: {long: null, lat: null},
                //     }),
                // );
            }
        }
    }

    //= ==================================================  end of code ===================================================
    return (
        <div
            style={{height: "80vh", width: "70vw"}}
            ref={mapContainer}
        />
    );
};
BaseMap.propTypes = {
    areaList: PropTypes.object,
};

export default BaseMap;
