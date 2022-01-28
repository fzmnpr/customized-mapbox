/* eslint-disable indent */
import React from 'react';
import { Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

function CustomAppInput({ label, name, formtext, ...rest }) {
  const StyledInputBase = makeStyles(theme => ({
    root: {
      '& label.Mui-focused': {
        // color: theme.palette.primary.main,
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderWidth: 2,
          borderRadius: '10px',
          // height: 45,
          margin: 0,
        },
        '&:hover fieldset': {
          //   borderColor: theme.palette.primary.main,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.text[100],
          borderRadius: '10px',
        },
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
  }));
  const classes = StyledInputBase();
  return (
    <Field name={name}>
      {({ field, form }) => (
        <TextField
          label={label}
          classes={classes}
          id={name}
          {...rest}
          {...field}
          autoCorrect="off"
          spellCheck={false}
          FormHelperTextProps={{
            style:
              // eslint-disable-next-line no-nested-ternary
              form.errors[name]?.props?.defaultMessage?.length &&
              form.errors[name]?.props?.defaultMessage?.length < 40
                ? { position: 'absolute', bottom: '-50%' }
                : form.errors[name]?.length < 40
                ? { position: 'absolute', bottom: '-50%' }
                : {},
          }}
          autoComplete="new-password"
          error={form.errors[name] && form.touched[name]}
          helperText={form.touched[name] && form.errors[name]}
        />
      )}
    </Field>
  );
}

CustomAppInput.propTypes = {
  label: PropTypes.any,
  name: PropTypes.string,
  formtext: PropTypes.any,
};

export default CustomAppInput;
