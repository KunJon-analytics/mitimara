import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MyTrees from "./_components/my-trees";

export default function MyTreesPage() {
  return (
    <div className="container mx-auto p-4 mb-16">
      <h1 className="text-2xl font-bold mb-2">My Trees </h1>
      <p className="mb-4">
        Track your planted trees and take action to ensure their verification:
      </p>
      <Tabs defaultValue="unverified" className="">
        <TabsList>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="fake">Fake</TabsTrigger>
        </TabsList>
        <TabsContent value="unverified">
          <h3 className="mb-4 text-sm text-muted-foreground">
            Upload evidence (photo/video) or wait for a nearby verifier. Speed
            things up by referring a friend to verify and earn referral points!
          </h3>

          <MyTrees filter="unverified" />
        </TabsContent>
        <TabsContent value="fake">
          <h3 className="mb-4 text-sm text-muted-foreground">
            Report verifiers if your tree was incorrectly marked as fake.
          </h3>
          <MyTrees filter="fake" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
