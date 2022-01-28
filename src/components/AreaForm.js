import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CustomAppInput from './CustomAppInput';

const useStyles = makeStyles(() => ({
    form: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textField: {
        marginLeft: '-20px',
        width: '50%',
    },
}));

export default function AreaForm({feature, ...rest}) {
    const {formRef, onSubmitClick} = rest;
    const classes = useStyles();
    const initialValues = {
        areaName: feature.properties.name || '',
        areaLevel: feature.properties.level || '',
        drawID: feature.id,
    };
    const validationSchema = Yup.object().shape({
        areaName: Yup.string().required('required'),
        areaLevel: Yup.number().required('please enter number'),
    });

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmitClick}
            innerRef={formRef}
        >
            {formik => (
                <Form className={classes.form}>
                    <div
                        style={{
                            // backgroundColor: 'blue',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        <p
                            style={{
                                fontSize: '16px',
                                color: '#023056',
                                fontWeight: '500',
                            }}
                        >
                            Name
                        </p>
                        <CustomAppInput
                            name="areaName"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        <p
                            style={{fontSize: '16px', color: '#023056', fontWeight: '500'}}
                        >
                            level
                        </p>
                        <CustomAppInput
                            name="areaLevel"
                            className={classes.textField}
                            variant="outlined"
                            size="small"
                        />
                    </div>

                    <div className={classes.actions}>
                        <Button
                            type="submit"
                            // disabled={!formik.dirty}
                            disabled={!formik.isValid}
                            variant="contained"
                            style={{
                                height: '70%',
                                fontSize: '12px',
                                backgroundColor: '#6EC6BD',
                            }}
                        >
                            {feature.properties.name && feature.properties.level
                                ? 'Save'
                                : 'Submit'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
AreaForm.propTypes = {
    feature: PropTypes.object,
};
