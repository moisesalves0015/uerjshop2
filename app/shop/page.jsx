"use client";

import Loader from "@components/Loader";
import Navbar from "@components/Navbar";
import WorkList from "@components/WorkList";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import "@styles/Shop.scss";

const ShopContent = () => {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?._id;

  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");

  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWorkList = async () => {
      const response = await fetch(`api/user/${profileId}/shop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setWorkList(data.workList);
      setProfile(data.user);
      setLoading(false);
    };

    if (profileId) {
      getWorkList();
    }
  }, [profileId]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      {loggedInUserId === profileId ? (
        <h1 className="title-list">Seus anúncios</h1>
      ) : (
        <h1 className="title-list">{profile.username} anúncios</h1>
      )}

      <WorkList data={workList} />
    </>
  );
};

const Shop = () => (
  <Suspense fallback={<Loader />}>
    <ShopContent />
  </Suspense>
);

export default Shop;
