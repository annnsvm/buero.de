// import React, { useEffect } from 'react';
// import { useAppDispatch } from '@/redux/hooks';
// import { refreshUserThunk } from '@/redux/slices/auth/authThunks';
// import { fetchCoursesCatalogThunk } from '@/redux/slices/coursesCatalog/coursesCatalogThunks';
// import { fetchSubscriptionStatusThunk } from '@/redux/slices/subscriptions/subscriptionsThunks';
// // import { ProfileErrorBoundary, ProfileLayout } from '@/features/profile';

// import { ProfileLayout } from '@/features/profile';


// const UserProfilePage = () => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     void dispatch(refreshUserThunk());
//     void dispatch(fetchCoursesCatalogThunk());
//     void dispatch(fetchSubscriptionStatusThunk());
//   }, [dispatch]);

//   return (
//     // <ProfileErrorBoundary>
//       <ProfileLayout
//         onAvatarSelect={(file) =>
//           console.info('[UserProfilePage] avatar file (stub)', file?.name ?? null, file)
//         }
//       />
//     // </ProfileErrorBoundary>
//   );
// };

// export default UserProfilePage;
