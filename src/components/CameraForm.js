/* eslint-disable indent */
import React, {memo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {InView} from 'react-intersection-observer';
import PropTypes from 'prop-types';


const CameraForm = ({onMount, ...rest}) => {
    const {allCameras, onSubmitClick, center, feature} = rest;
    const [inValue, setInValue] = useState('');
    const useStyles = makeStyles(() => ({
        formField: {
            display: 'inline-flex',
            marginTop: 10,
            width: '100%',
        },
        addBtnDiv: {
            display: 'flex',
            justifyContent: 'center',
            width: 50,
            marginLeft: 20,
        },
        btnRoot: {
            '&:hover': {
                color: '#81CFC8',
            },
        },
    }));
    const classes = useStyles();
    return (
        <InView as="section" onChange={onMount}>
            <div className={classes.formField}>
                {/*<CameraAutocomplete*/}
                {/*    allCameras={allCameras}*/}
                {/*    inValue={inValue}*/}
                {/*    setInValue={setInValue}*/}
                {/*    addCameraToList={r => {*/}
                {/*        const props = allCameras.filter(*/}
                {/*            el => el[0].toString() === r.toString(),*/}
                {/*        )[0];*/}
                {/*        // props[7] = center.geometry.coordinates[0]; // notice : we want :[lat , long] :[35,51]*/}
                {/*        // props[8] = center.geometry.coordinates[1];*/}
                {/*        // props[9] = feature.id;*/}
                {/*        [props[7], props[8], props[9]] = [*/}
                {/*            center.geometry.coordinates[0],*/}
                {/*            center.geometry.coordinates[1],*/}
                {/*            feature.id,*/}
                {/*        ];*/}
                {/*        onSubmitClick(props);*/}
                {/*    }}*/}
                {/*/>*/}
            </div>
        </InView>
    );
};

CameraForm.propTypes = {
    onMount: PropTypes.func,
};

export default memo(CameraForm);
