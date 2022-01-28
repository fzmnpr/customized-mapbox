import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {makeStyles} from '@material-ui/core/styles';
import * as ActionIcons from '../asset/icons';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import PropTypes from 'prop-types';

export default function AreaListPaper({areaList, ...rest}) {
    const {switchVisibility, editItem, deleteItem} = rest;
    const [expanded, setExpanded] = useState(false);
    useEffect(() => {
        setExpanded(true);
    }, [areaList.features.length]);

    //= ========================== ItemEditor ======================================
    const ItemEditor = ({el}) => (
        <IconButton
            onClick={() => {
                editItem(el);
            }}
            style={{padding: '2px'}}
        >
            <SvgIcon
                component={ActionIcons.editActive}
                viewBox="0 0 100 100"
                style={{height: '20px', padding: '2px'}}
            />
        </IconButton>
    );
    ItemEditor.propTypes = {
        el: PropTypes.object,
    };
    //= ========================== ItemRemover ======================================
    const ItemRemover = ({el}) => (
        <IconButton onClick={() => deleteItem(el)} style={{padding: '2px'}}>
            <SvgIcon
                component={ActionIcons.trashActive}
                viewBox="0 0 100 100"
                style={{height: '20px', padding: '2px'}}
            />
        </IconButton>
    );
    ItemRemover.propTypes = {
        el: PropTypes.object,
    };
    const useStyles = makeStyles(() => ({
        container: {
            overflowY: 'scroll',
            maxHeight: 250,
            minWidth: 320,
            marginBottom: '10px',
        },
        header: {
            fontSize: '10px',
            textAlign: 'center',
            padding: '11px',
        },
        content: {
            fontSize: '10px',
            textAlign: 'center',
            padding: '2px',
        },
    }));
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Accordion
                style={{backgroundColor: '#4F7494'}}
                expanded={expanded}
                onChange={() => setExpanded(prevState => !prevState)}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography style={{color: 'white'}}>list of draw area</Typography>
                </AccordionSummary>
                <AccordionDetails style={{backgroundColor: '#4EBECB', padding: '0'}}>
                    <Table
                        style={{
                            width: '100%',
                            borderLeftColor: '#6788a2',
                            borderLeftStyle: 'solid',
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell className={classes.header} style={{width: '15%'}}>
                                    Id
                                </TableCell>
                                <TableCell className={classes.header} style={{width: '25%'}}>
                                    Name
                                </TableCell>
                                <TableCell className={classes.header} style={{width: '20%'}}>
                                    Level
                                </TableCell>
                                <TableCell className={classes.header} style={{width: '20%'}}>
                                    Off/On
                                </TableCell>
                                <TableCell className={classes.header} style={{width: '20%'}}>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody
                            style={{backgroundColor: 'white'}}
                            borderleft="1px solid #e5e5e5"
                        >
                            {areaList.features.map((el, idx = el.id) => (
                                <TableRow key={idx}>
                                    <TableCell
                                        className={classes.content}
                                        style={{width: '15%'}}
                                    >
                                        {el.properties.area_id}
                                    </TableCell>
                                    <TableCell
                                        className={classes.content}
                                        style={{width: '25%'}}
                                    >
                                        {el.properties.name}
                                    </TableCell>
                                    <TableCell
                                        className={classes.content}
                                        style={{width: '20%'}}
                                    >
                                        {el.properties.level}
                                    </TableCell>
                                    <TableCell
                                        className={classes.content}
                                        style={{width: '20%'}}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={!el.properties.portVis}
                                                    onChange={() => {
                                                        switchVisibility(el);
                                                    }}
                                                    name="enable"
                                                    color="primary"
                                                />
                                            }
                                            style={{padding: '0px'}}
                                        />
                                    </TableCell>
                                    <TableCell
                                        className={classes.content}
                                        style={{width: '20%'}}
                                    >
                                        <ItemRemover el={el}/>
                                        <ItemEditor el={el}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
AreaListPaper.propTypes = {
    areaList: PropTypes.object,
};
