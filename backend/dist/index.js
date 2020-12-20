/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./src/dbAccessor.ts":
      /*!***************************!*\
  !*** ./src/dbAccessor.ts ***!
  \***************************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.DBAccessor = void 0;
        const pg_1 = __webpack_require__(/*! pg */ "pg");
        const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
        const pool = new pg_1.Pool({
          database: "database_development",
          user: "takahashiry",
          password: "****",
          host: "127.0.0.1",
          port: 5432,
        });
        class DBAccessor {
          constructor() {
            this.get = async () => {
              const client = await pool.connect();
              try {
                const query = {
                  text: 'select * from public."TodoTasks"',
                };
                const result = await client.query(query);
                return result.rows;
              } catch (err) {
                console.error(err);
                throw err;
              } finally {
                client.release();
              }
            };
            this.create = async (title) => {
              const client = await pool.connect();
              try {
                const query = {
                  text:
                    'insert into public."TodoTasks" (uuid, title, "createdAt", "updatedAt") VALUES($1, $2, current_timestamp, current_timestamp)',
                  values: [uuid_1.v4(), title],
                };
                await client.query(query);
              } catch (err) {
                console.error(err);
                throw err;
              } finally {
                client.release();
              }
            };
            this.update = async ({ uuid, title, status }) => {
              console.log(uuid, title, status);
              const client = await pool.connect();
              try {
                const query = {
                  text:
                    'update public."TodoTasks" set title = $2, status=$3 where uuid = $1',
                  values: [uuid, title, status],
                };
                await client.query(query);
              } catch (err) {
                console.error(err);
                throw err;
              } finally {
                client.release();
              }
            };
            this.delete = async ({ uuid }) => {
              const client = await pool.connect();
              try {
                const query = {
                  text: 'delete from public."TodoTasks" where uuid = $1',
                  values: [uuid],
                };
                await client.query(query);
              } catch (err) {
                console.error(err);
                throw err;
              } finally {
                client.release();
              }
            };
          }
        }
        exports.DBAccessor = DBAccessor;

        /***/
      },

    /***/ "./src/index.ts":
      /*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
      /***/ function (__unused_webpack_module, exports, __webpack_require__) {
        var __importDefault =
          (this && this.__importDefault) ||
          function (mod) {
            return mod && mod.__esModule ? mod : { default: mod };
          };
        Object.defineProperty(exports, "__esModule", { value: true });
        const express_1 = __importDefault(
          __webpack_require__(/*! express */ "express")
        );
        const cors_1 = __importDefault(__webpack_require__(/*! cors */ "cors"));
        const body_parser_1 = __importDefault(
          __webpack_require__(/*! body-parser */ "body-parser")
        );
        const router_1 = __webpack_require__(/*! ./router */ "./src/router.ts");
        const app = express_1.default();
        app.use(cors_1.default());
        app.use(body_parser_1.default.urlencoded({ extended: false }));
        app.use(body_parser_1.default.json());
        const port = 3000;
        app.use("/", router_1.createRouter());
        app.listen(port, () => {
          console.log(`Listening at http://localhost:${port}/`);
        });

        /***/
      },

    /***/ "./src/router.ts":
      /*!***********************!*\
  !*** ./src/router.ts ***!
  \***********************/
      /***/ (__unused_webpack_module, exports, __webpack_require__) => {
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.createRouter = void 0;
        const express_1 = __webpack_require__(/*! express */ "express");
        const dbAccessor_1 = __webpack_require__(
          /*! ./dbAccessor */ "./src/dbAccessor.ts"
        );
        const dbAccessor = new dbAccessor_1.DBAccessor();
        const createRouter = () => {
          const router = express_1.Router();
          router.get("/", async (req, res) => {
            try {
              const resBody = await dbAccessor.get();
              res.status(200).send({ message: "get success", resBody });
            } catch (err) {
              console.error(err);
              res.status(400).send({ message: "get failed" });
            }
          });
          router.put("/", async (req, res) => {
            try {
              if (!req.body.title) {
                res.status(400).send({ message: "title required" });
              }
              await dbAccessor.create(req.body.title);
              res.status(200).send({ message: "create success" });
            } catch (err) {
              console.error(err);
              res.status(400).send({ message: "create failed" });
            }
          });
          router.post("/:taskID", async (req, res) => {
            try {
              if (!req.body) {
                res.status(400).send({ message: "body required" });
              }
              await dbAccessor.update({ uuid: req.params.taskID, ...req.body });
              res.status(200).send({ message: "update success" });
            } catch (err) {
              console.error(err);
              res.status(400).send({ message: "update failed" });
            }
          });
          router.delete("/:taskID", async (req, res) => {
            try {
              if (!req.body) {
                res.status(400).send({ message: "body required" });
              }
              await dbAccessor.delete({ uuid: req.params.taskID });
              res.status(200).send({ message: "delete success" });
            } catch (err) {
              console.error(err);
              res.status(400).send({ message: "delete failed" });
            }
          });
          return router;
        };
        exports.createRouter = createRouter;

        /***/
      },

    /***/ "body-parser":
      /*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
      /***/ (module) => {
        module.exports = require("body-parser");

        /***/
      },

    /***/ cors:
      /*!***********************!*\
  !*** external "cors" ***!
  \***********************/
      /***/ (module) => {
        module.exports = require("cors");

        /***/
      },

    /***/ express:
      /*!**************************!*\
  !*** external "express" ***!
  \**************************/
      /***/ (module) => {
        module.exports = require("express");

        /***/
      },

    /***/ pg:
      /*!*********************!*\
  !*** external "pg" ***!
  \*********************/
      /***/ (module) => {
        module.exports = require("pg");

        /***/
      },

    /***/ uuid:
      /*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
      /***/ (module) => {
        module.exports = require("uuid");

        /***/
      },

    /******/
  }; // The module cache
  /************************************************************************/
  /******/ /******/ var __webpack_module_cache__ = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ if (__webpack_module_cache__[moduleId]) {
      /******/ return __webpack_module_cache__[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ __webpack_modules__[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // startup // Load entry module // This entry module is referenced by other modules so it can't be inlined
  /******/
  /************************************************************************/
  /******/ /******/ /******/ /******/ __webpack_require__("./src/index.ts");
  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYWNrZW5kLy4vc3JjL2RiQWNjZXNzb3IudHMiLCJ3ZWJwYWNrOi8vYmFja2VuZC8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9iYWNrZW5kLy4vc3JjL3JvdXRlci50cyIsIndlYnBhY2s6Ly9iYWNrZW5kL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly9iYWNrZW5kL2V4dGVybmFsIFwiY29yc1wiIiwid2VicGFjazovL2JhY2tlbmQvZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vYmFja2VuZC9leHRlcm5hbCBcInBnXCIiLCJ3ZWJwYWNrOi8vYmFja2VuZC9leHRlcm5hbCBcInV1aWRcIiIsIndlYnBhY2s6Ly9iYWNrZW5kL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhY2tlbmQvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxpREFBMEI7QUFDMUIsdURBQW9DO0FBRXBDLE1BQU0sSUFBSSxHQUFHLElBQUksU0FBSSxDQUFDO0lBQ3BCLFFBQVEsRUFBRSxzQkFBc0I7SUFDaEMsSUFBSSxFQUFFLGFBQWE7SUFDbkIsUUFBUSxFQUFFLGVBQWU7SUFDekIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLElBQUk7Q0FDWCxDQUFDLENBQUM7QUFFSCxNQUFhLFVBQVU7SUFBdkI7UUFDUyxRQUFHLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDdEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEMsSUFBSTtnQkFDRixNQUFNLEtBQUssR0FBRztvQkFDWixJQUFJLEVBQUUsa0NBQWtDO2lCQUN6QyxDQUFDO2dCQUNGLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDO2FBQ3BCO1lBQUMs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bmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvb2wgfSBmcm9tIFwicGdcIjtcclxuaW1wb3J0IHsgdjQgYXMgdXVpZHY0IH0gZnJvbSBcInV1aWRcIjtcclxuXHJcbmNvbnN0IHBvb2wgPSBuZXcgUG9vbCh7XHJcbiAgZGF0YWJhc2U6IFwiZGF0YWJhc2VfZGV2ZWxvcG1lbnRcIixcclxuICB1c2VyOiBcInRha2FoYXNoaXJ5XCIsXHJcbiAgcGFzc3dvcmQ6IFwidGFrYWhhc2hpMDgxM1wiLFxyXG4gIGhvc3Q6IFwiMTI3LjAuMC4xXCIsXHJcbiAgcG9ydDogNTQzMixcclxufSk7XHJcblxyXG5leHBvcnQgY2xhc3MgREJBY2Nlc3NvciB7XHJcbiAgcHVibGljIGdldCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IHBvb2wuY29ubmVjdCgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcXVlcnkgPSB7XHJcbiAgICAgICAgdGV4dDogJ3NlbGVjdCAqIGZyb20gcHVibGljLlwiVG9kb1Rhc2tzXCInLFxyXG4gICAgICB9O1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjbGllbnQucXVlcnkocXVlcnkpO1xyXG4gICAgICByZXR1cm4gcmVzdWx0LnJvd3M7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBjbGllbnQucmVsZWFzZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBjcmVhdGUgPSBhc3luYyAodGl0bGU6IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgY2xpZW50ID0gYXdhaXQgcG9vbC5jb25uZWN0KCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBxdWVyeSA9IHtcclxuICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgJ2luc2VydCBpbnRvIHB1YmxpYy5cIlRvZG9UYXNrc1wiICh1dWlkLCB0aXRsZSwgXCJjcmVhdGVkQXRcIiwgXCJ1cGRhdGVkQXRcIikgVkFMVUVTKCQxLCAkMiwgY3VycmVudF90aW1lc3RhbXAsIGN1cnJlbnRfdGltZXN0YW1wKScsXHJcbiAgICAgICAgdmFsdWVzOiBbdXVpZHY0KCksIHRpdGxlXSxcclxuICAgICAgfTtcclxuICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KHF1ZXJ5KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIGNsaWVudC5yZWxlYXNlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIHVwZGF0ZSA9IGFzeW5jICh7XHJcbiAgICB1dWlkLFxyXG4gICAgdGl0bGUsXHJcbiAgICBzdGF0dXMsXHJcbiAgfToge1xyXG4gICAgdXVpZDogc3RyaW5nO1xyXG4gICAgdGl0bGU6IHN0cmluZztcclxuICAgIHN0YXR1czogc3RyaW5nO1xyXG4gIH0pID0+IHtcclxuICAgIGNvbnNvbGUubG9nKHV1aWQsIHRpdGxlLCBzdGF0dXMpO1xyXG4gICAgY29uc3QgY2xpZW50ID0gYXdhaXQgcG9vbC5jb25uZWN0KCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBxdWVyeSA9IHtcclxuICAgICAgICB0ZXh0OlxyXG4gICAgICAgICAgJ3VwZGF0ZSBwdWJsaWMuXCJUb2RvVGFza3NcIiBzZXQgdGl0bGUgPSAkMiwgc3RhdHVzPSQzIHdoZXJlIHV1aWQgPSAkMScsXHJcbiAgICAgICAgdmFsdWVzOiBbdXVpZCwgdGl0bGUsIHN0YXR1c10sXHJcbiAgICAgIH07XHJcbiAgICAgIGF3YWl0IGNsaWVudC5xdWVyeShxdWVyeSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBjbGllbnQucmVsZWFzZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBkZWxldGUgPSBhc3luYyAoeyB1dWlkIH06IHsgdXVpZDogc3RyaW5nIH0pID0+IHtcclxuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IHBvb2wuY29ubmVjdCgpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgcXVlcnkgPSB7XHJcbiAgICAgICAgdGV4dDogJ2RlbGV0ZSBmcm9tIHB1YmxpYy5cIlRvZG9UYXNrc1wiIHdoZXJlIHV1aWQgPSAkMScsXHJcbiAgICAgICAgdmFsdWVzOiBbdXVpZF0sXHJcbiAgICAgIH07XHJcbiAgICAgIGF3YWl0IGNsaWVudC5xdWVyeShxdWVyeSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBjbGllbnQucmVsZWFzZSgpO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuIiwiaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IGNvcnMgZnJvbSBcImNvcnNcIjtcclxuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSBcImJvZHktcGFyc2VyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZVJvdXRlciB9IGZyb20gXCIuL3JvdXRlclwiO1xyXG5cclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5hcHAudXNlKGNvcnMoKSk7XHJcbmFwcC51c2UoYm9keVBhcnNlci51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlIH0pKTtcclxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XHJcblxyXG5jb25zdCBwb3J0ID0gMzAwMDtcclxuXHJcbmFwcC51c2UoXCIvXCIsIGNyZWF0ZVJvdXRlcigpKTsgLy8gYWRkXHJcblxyXG5hcHAubGlzdGVuKHBvcnQsICgpID0+IHtcclxuICBjb25zb2xlLmxvZyhgTGlzdGVuaW5nIGF0IGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9gKTtcclxufSk7XHJcbiIsImltcG9ydCB7IFJvdXRlciB9IGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7IERCQWNjZXNzb3IgfSBmcm9tIFwiLi9kYkFjY2Vzc29yXCI7XHJcblxyXG5jb25zdCBkYkFjY2Vzc29yID0gbmV3IERCQWNjZXNzb3IoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVSb3V0ZXIgPSAoKSA9PiB7XHJcbiAgY29uc3Qgcm91dGVyID0gUm91dGVyKCk7XHJcblxyXG4gIC8vIFJlYWRcclxuICByb3V0ZXIuZ2V0KFwiL1wiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlc0JvZHkgPSBhd2FpdCBkYkFjY2Vzc29yLmdldCgpO1xyXG4gICAgICByZXMuc3RhdHVzKDIwMCkuc2VuZCh7IG1lc3NhZ2U6IFwiZ2V0IHN1Y2Nlc3NcIiwgcmVzQm9keSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2FnZTogXCJnZXQgZmFpbGVkXCIgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIENyZWF0ZVxyXG4gIHJvdXRlci5wdXQoXCIvXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKCFyZXEuYm9keS50aXRsZSkge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2FnZTogXCJ0aXRsZSByZXF1aXJlZFwiIH0pO1xyXG4gICAgICB9XHJcbiAgICAgIGF3YWl0IGRiQWNjZXNzb3IuY3JlYXRlKHJlcS5ib2R5LnRpdGxlKTtcclxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBtZXNzYWdlOiBcImNyZWF0ZSBzdWNjZXNzXCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NhZ2U6IFwiY3JlYXRlIGZhaWxlZFwiIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBVcGRhdGVcclxuICByb3V0ZXIucG9zdChcIi86dGFza0lEXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKCFyZXEuYm9keSkge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2FnZTogXCJib2R5IHJlcXVpcmVkXCIgfSk7XHJcbiAgICAgIH1cclxuICAgICAgYXdhaXQgZGJBY2Nlc3Nvci51cGRhdGUoeyB1dWlkOiByZXEucGFyYW1zLnRhc2tJRCwgLi4ucmVxLmJvZHkgfSk7XHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgbWVzc2FnZTogXCJ1cGRhdGUgc3VjY2Vzc1wiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoeyBtZXNzYWdlOiBcInVwZGF0ZSBmYWlsZWRcIiB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gRGVsZXRlXHJcbiAgcm91dGVyLmRlbGV0ZShcIi86dGFza0lEXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKCFyZXEuYm9keSkge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5zZW5kKHsgbWVzc2FnZTogXCJib2R5IHJlcXVpcmVkXCIgfSk7XHJcbiAgICAgIH1cclxuICAgICAgYXdhaXQgZGJBY2Nlc3Nvci5kZWxldGUoeyB1dWlkOiByZXEucGFyYW1zLnRhc2tJRCB9KTtcclxuICAgICAgcmVzLnN0YXR1cygyMDApLnNlbmQoeyBtZXNzYWdlOiBcImRlbGV0ZSBzdWNjZXNzXCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMCkuc2VuZCh7IG1lc3NhZ2U6IFwiZGVsZXRlIGZhaWxlZFwiIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcm91dGVyO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJib2R5LXBhcnNlclwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGdcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV1aWRcIik7OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9
