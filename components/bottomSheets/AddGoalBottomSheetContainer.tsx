import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Keyboard} from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {TextInput} from 'react-native-gesture-handler';
import {useGoalData} from '@/hooks/useGoalData';
import {generateUUID} from '@/utils/uuid';
import {AddGoalBottomSheet} from '@/components/mainScreen/goal/AddGoalBottomSheet';
import {dateUtils} from '@/utils/dateUtils';
import {useGoalStore} from '@/stores/goalStore';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {commonBottomSheetProps, commonStyles} from './bottomSheetCommon';

interface AddGoalBottomSheetContainerProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
}

export function AddGoalBottomSheetContainer({
  bottomSheetRef,
}: AddGoalBottomSheetContainerProps) {
  const [tempEditableTitle, setTempEditableTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const titleInputRef = useRef<TextInput>(null);

  const {setSelectedGoalId} = useGoalStore();
  const {actions} = useGoalData('');

  const icons = useMemo(
    () => [
      [
        'coins',
        'dice',
        'plane-departure',
        'basketball-ball',
        'battery-full',
        'book',
      ],
      ['brain', 'briefcase', 'flask', 'microphone-alt', 'camera-retro', 'car'],
      ['chart-line', 'child', 'city', 'first-order-alt', 'archive', 'tools'],
      [
        'dumbbell',
        'hubspot',
        'globe-americas',
        'graduation-cap',
        'heartbeat',
        'splotch',
      ],
      ['leaf', 'medal', 'mountain', 'paint-brush', 'paw', 'running'],
      ['gift', 'hourglass-half', 'headphones', 'tree', 'hotjar', 'money-bill'],
    ],
    [],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
    }
  }, []);

  const {goalData} = useGoalStore();

  const handleAddGoal = () => {
    if (tempEditableTitle === '') {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: '목표를 입력해주세요.',
        textBody: '한 글자 이상 입력해주세요',
      });
      return;
    }

    if (tempEditableTitle.length > 30) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: '글자 수 제한',
        textBody: '30자 이하로 입력해주세요',
      });
      return;
    }

    if (selectedIcon === '') {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: '아이콘 하나를 선택해 주세요',
        textBody: '아이콘은 반드시 선택해야해요',
      });
      return;
    }

    if (goalData.length >= 10) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: '목표 개수 제한',
        textBody: '최대 10개까지 목표를 만들 수 있어요',
      });
      return;
    }

    const goalId = generateUUID();
    const today = dateUtils.formatToAppDate(dateUtils.getToday());
    actions.goal.add({
      id: goalId,
      achieved: [],
      todos: [],
      title: tempEditableTitle,
      icon: selectedIcon,
      createdDate: today,
      dDay: {
        date: today,
        remainingDays: 0,
      },
      isCompleted: false,
    });
    bottomSheetRef.current?.close();
    setTempEditableTitle('');
    setSelectedIcon('archway');
    setSelectedGoalId(goalId);

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: '추가 완료',
      textBody: '목표가 추가되었어요',
    });
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      backdropComponent={renderBackdrop}
      style={commonStyles.bottomSheet}
      onChange={handleSheetChanges}
      {...commonBottomSheetProps}>
      <BottomSheetView style={commonStyles.contentContainer}>
        <AddGoalBottomSheet
          title={tempEditableTitle}
          setTitle={setTempEditableTitle}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          onAddGoal={handleAddGoal}
          icons={icons}
          inputRef={titleInputRef}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}
