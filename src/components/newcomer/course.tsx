import { Section, SectionMapType } from '@deschool-protocol/react';
import { useState } from 'react';

// const TOPIC_ID = '63f786e3d4d9f2d31956b01f';

export interface ICourseProps {
  courseId: string;
  sectionId: string;
  sectionType: SectionMapType;
}

export default function LearnCourse({ courseId, sectionId, sectionType }: ICourseProps) {
  // const [sectionId, setSectionId] = useState('63a46ae99ce6e09dd4811471');
  const onHotUpdateSectionStatus = (sid: string) => {};
  return (
    <Section
      currentCourseId="62f0adc68b90ee1aa913a966"
      sectionFinished={false}
      hotUpdateSectionStatus={onHotUpdateSectionStatus}
      currentSection={{
        id: sectionId,
        type: sectionType,
      }}
    />
  );
}
