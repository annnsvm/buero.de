import React from 'react';
import { Button, Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { AddNewCourseProps } from '@/types/features/courseManagment/AddNewCourse.types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/helpers/routes';

const AddNewCourse: React.FC<AddNewCourseProps> = ({ type }) => {
  const navigation = useNavigate();
  const handleClick = () => {
    navigation(ROUTES.TEACHER_COURSES_CREATE);
  };
  return type === 'button' ? (
    <Button type="button" variant="solid" onClick={handleClick}>
      Create New Course
    </Button>
  ) : (
    <button type="button" onClick={handleClick}>
      <Icon
        name={ICON_NAMES.ADD_RECORD}
        size={100}
        strokeWidth={1}
        className="text-[var(--color-neutral-base)] duration-300 ease-in-out hover:text-[var(--color-neutral-darkest)]"
      />
    </button>
  );
};

export default AddNewCourse;
