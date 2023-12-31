import { Section, SectionMapType } from '@deschool-protocol/react';
import { useState } from 'react';

// const TOPIC_ID = '63f786e3d4d9f2d31956b01f';

export interface ICourseProps {
  courseId: string;
  sectionId: string;
  sectionType: SectionMapType;
}

export default function LearnCourse({ courseId, sectionId, sectionType }: ICourseProps) {
  const onHotUpdateSectionStatus = (sid: string) => {};
  return (
    <Section
      className='see-section'
      currentCourseId={courseId}
      sectionFinished={false}
      hotUpdateSectionStatus={onHotUpdateSectionStatus}
      currentSection={{
        id: sectionId,
        type: sectionType,
      }}
    />
  );
}
